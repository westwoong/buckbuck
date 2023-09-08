import {Injectable} from '@nestjs/common';
import {SignUpRequestDto} from "./dto/signUp.request.dto";

@Injectable()
export class UserService {

    signUp(signUpRequestDto: SignUpRequestDto) {
        const {account, password, name, email, phoneNumber, nickName} = signUpRequestDto;

        console.log(account, password, name, email, phoneNumber, nickName);

        return signUpRequestDto;


    }
}
