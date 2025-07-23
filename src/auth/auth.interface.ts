import { LoginDto, RegisterDto } from './dto/req-auth.dto';
import { ResponseLoginDto, ResponseRegisterDto } from './dto/resp-auth.dto';

export interface IAuthService {
  register(dto: RegisterDto): Promise<ResponseRegisterDto>;
  login(dto: LoginDto): Promise<ResponseLoginDto | null>;
}
