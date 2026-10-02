export const setNotificationHandler = () => {};
export const getPermissionsAsync = async () => ({ granted: true });
export const requestPermissionsAsync = async () => ({ granted: true });
export const scheduleNotificationAsync = async () => 'n';
export const cancelScheduledNotificationAsync = async () => {};
export const getAllScheduledNotificationsAsync = async () => [];
export const SchedulableTriggerInputTypes = { TIME_INTERVAL: 'timeInterval', DATE: 'date' };
export const addNotificationResponseReceivedListener = () => ({ remove() {} });
