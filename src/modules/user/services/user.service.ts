import {Injectable, Logger} from "@nestjs/common";


@Injectable()
export class UserService {
    constructor(
    ) {}

    public async create(createUserDto: any): Promise<any> {
        Logger.log(createUserDto);
        return 'This action adds a new user';
    }

    public async findAll(): Promise<string> {
        return `This action returns all user`;
    }




}