import axios from "axios";

const nameCache: Record<string, string> = {};

export const getNameByUid = async (uid: string): Promise<string> => {
    if (nameCache[uid]) return nameCache[uid];
    try {
        console.log('turning uid to name:', uid);
        const res = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/users/${uid}`);
        nameCache[uid] = res.data.first_name;
        return res.data.first_name;
    } catch (error) {
        console.error("Failed to fetch user name:", error);
        console.log('req: ', `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/users/${uid}`);
        return "-1";
    }
}