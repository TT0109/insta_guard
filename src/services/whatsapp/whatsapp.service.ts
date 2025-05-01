import { UserInfoResponse } from "@/interface/UserInfoResponse";
import api from "@/lib/axios/whatsapp";

export class Whatsapp {
  constructor() { }

  async getUserInfo(whatsappNumber: string): Promise<UserInfoResponse> {
    try {
      const response = await api.get(`number/${whatsappNumber}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching user info:', err);
      throw err;
    }
  }
}