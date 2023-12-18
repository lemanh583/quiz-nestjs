// jwt.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let authorization = req.headers.authorization
    const token = authorization && authorization.split(' ')[1];

    if (token) {
      try {
        const decoded = verify(token, process.env.SECRET_KEY_TOKEN); // Thay thế bằng secret key thực tế của bạn
        req['user'] = decoded; // Lưu thông tin user vào request để sử dụng trong controller
      } catch (error) {
        // Xử lý lỗi xác minh token
        console.error(error);
      }
    }
    next();
  }
}
