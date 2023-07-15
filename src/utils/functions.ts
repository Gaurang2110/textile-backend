import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class UtilityFunctions {
  objectId(id) {
    return new mongoose.Types.ObjectId(id);
  }

  getErrorMessage(err: any) {
    let message = err.message;
    if (err.code === 11000) {
      message = Object.keys(err.keyValue)[0] + ' already exists.';
    }
    return message;
  }

  async cryptPassword(password) {
    try {
      const hashPassword = await bcrypt.hash(password, 10);
      return { error: null, hashPassword };
    } catch (error) {
      return { error, hashPassword: null };
    }
  }

  async comparePassword(plainPass, hash) {
    try {
      const isMatch = await bcrypt.compare(plainPass, hash);
      return { error: null, isMatch };
    } catch (error) {
      return { error, isMatch: null };
    }
  }

  randomCode(length = 8) {
    const givenSet = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      const pos = Math.floor(Math.random() * givenSet.length);
      code += givenSet[pos];
    }
    return code;
  }
}
