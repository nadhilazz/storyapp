import { openDB } from 'idb';
 
const DATABASE_NAME = 'dicodingstory';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'saved-stories';
 
const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade: (database) => {
    if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      database.createObjectStore(OBJECT_STORE_NAME, {
        keyPath: 'id',
      });
    }
  },
});

const addStory = async (story) => {
  const db = await dbPromise;
  return db.put(OBJECT_STORE_NAME, story);
};

const getStory = async (id) => {
  const db = await dbPromise;
  return db.get(OBJECT_STORE_NAME, id);
};

const getAllStories = async () => {
  const db = await dbPromise;
  return db.getAll(OBJECT_STORE_NAME);
};

const deleteStory = async (id) => {
  const db = await dbPromise;
  return db.delete(OBJECT_STORE_NAME, id);
};

export { addStory, getStory, getAllStories, deleteStory };
