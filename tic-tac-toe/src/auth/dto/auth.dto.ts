import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, Matches, MinLength, ValidateIf } from "class-validator";
import { passwordRegEx } from "../../users/dto/users.dto";

export class SigninDto {
    @ApiProperty()
    username: string;

    @ValidateIf(o => !o.username)
    @IsEmail( undefined, { message: 'Please provide valid Email.' })
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @Matches(passwordRegEx, {
        message: `Password must contain Minimum 8 and maximum 20 characters, 
      at least one uppercase letter, 
      one lowercase letter, 
      one number and 
      one special character`,
    })
    @ApiProperty()
    password: string;
}