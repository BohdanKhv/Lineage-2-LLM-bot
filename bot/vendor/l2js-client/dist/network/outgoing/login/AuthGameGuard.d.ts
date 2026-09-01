import LoginServerPacket from "./LoginServerPacket";
export default class AuthGameGuard extends LoginServerPacket {
    sessionId: number;
    constructor(sessionId: number);
    write(): void;
}
