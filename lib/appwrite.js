import {
  Client,
  ID,
  Account,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";
const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.company.auro",
  projectId: "6657f870003c75a5a98d",
  storageId: "6658006400370f1a2bc4",
  databaseId: "6657fb770024bbf6fed2",
  userCollectionId: "6657fb940039f8231b18",
  videoCollectionId: "6657fbba00206d253c99",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);
// Register User
export const createAccount = async (username, email, password) => {
  // create a Auth User Account
  // check if account is created if yes the create avatar else throw an error
  // once avatar is created
  // sign In the current user so we can directly move to home page
  // and then save the user details in database

  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error("Could not create account");

    const avatarUrl = avatars.getInitials(username);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

// ---Logout
export const signOut = async () => {
  try {
    const deletedSession = await account.deleteSession("current");

    return deletedSession;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentAccount = async () => {
  try {
    const currentLoggedInAccount = await account.get();
    return currentLoggedInAccount;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await getCurrentAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

// --posts

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt", Query.limit(7))]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) {
      throw new Error("No documents found");
    }
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("users", userId)]
    );
    if (!posts) {
      throw new Error("No documents found");
    }
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

const getFileURL = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = await storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = await storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type...");
    }
    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

const uploadFile = async (file, type) => {
  if (!file) throw new Error("File not found");

  const { mimeType, ...rest } = file;
  const assest = { type: mimeType, ...rest };

  try {
    // -----Data has been uploaded in the database  but we want url  -----
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      assest
    );

    const fileUrl = await getFileURL(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

export const createVideoPost = async (form) => {
  const [thumbnailUrl, videoUrl] = await Promise.all([
    uploadFile(form.thumbnail, "image"),
    uploadFile(form.video, "video"),
  ]);

  console.log("thumbNail",thumbnailUrl);
  console.log("videoURL", videoUrl);

  try {
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        users: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
};
