import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Class, ClassSchema } from './schemas/class.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: Class.name,
          schema: ClassSchema
        },
        {
          name: User.name,
          schema: UserSchema
        }
      ]
    )
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, UsersService]
})
export class AttendanceModule { }
