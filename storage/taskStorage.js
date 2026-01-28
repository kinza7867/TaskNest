import AsyncStorage from '@react-native-async-storage/async-storage';

const TASK_KEY = 'TASKNEST_TASKS';

export const getTasks = async () => {
  const data = await AsyncStorage.getItem(TASK_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTasks = async (tasks) => {
  await AsyncStorage.setItem(TASK_KEY, JSON.stringify(tasks));
};
