import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cv } from './entities/cv.entity';

@Injectable()
export class CvService {
  [x: string]: any;
  constructor(@InjectModel(Cv.name) private readonly cvModel: Model<Cv>) { }

  async findAll(): Promise<Cv[]> {
    return this.cvModel.find().exec();
  }

  async createCv(data: any): Promise<Cv> {
    const newCv = new this.cvModel(data);
    return newCv.save();
  }

  async updateCv(id: string, data: any): Promise<Cv> {
    return this.cvModel.findByIdAndUpdate(id, data, { new: true });
  }

  async getCv(id: string): Promise<Cv> {
    return this.cvModel.findById({ _id: id });
  }

  async deleteCv(id: string): Promise<Cv> {
    return this.cvModel.findByIdAndDelete(id);
  }

  async getAllCvs(): Promise<Cv[]> {
    return this.cvModel.find();
  }

  async getCvByUserId(userId: string): Promise<Cv[]> {
    const data = await this.cvModel.find({ userId: userId });
    console.log(data)
    return data
  }

  // Tìm kiếm CV dựa trên trường và giá trị
  async searchCvs(field: string, value: string): Promise<Cv[]> {
    if (!field || !value) {
      return this.cvModel.find().exec();
    }

    // Danh sách các trường kiểu số
    const numericFields = ['minimumSalary'];

    let query: any;
    if (numericFields.includes(field)) {
      // Chuyển đổi value thành số
      const numericValue = Number(value);
      if (isNaN(numericValue)) {
        throw new Error('Invalid numeric value for field: ' + field);
      }
      query = { [field]: numericValue };
    } else {
      // Sử dụng RegExp cho các trường kiểu chuỗi
      const regex = new RegExp(value, 'i');
      query = { [field]: regex };
    }

    return this.cvModel.find(query).exec();
  }
  


}
