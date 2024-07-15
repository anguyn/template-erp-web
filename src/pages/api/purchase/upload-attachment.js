import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
// import FormData from 'form-data';
import purchaseApi from '@/service/ServiceLayer/purchaseApi';
// import fetch from "node-fetch"
// import { FormData as NodeFormData } from 'formdata-node';
// import { FormDataEncoder } from 'form-data-encoder';
import { FormData, File } from 'formdata-node';
import { fileFromPath } from 'formdata-node/file-from-path';
import { FormDataEncoder } from 'form-data-encoder';
import axios from 'axios';

const baseURL = `${process.env.NEXT_PUBLIC_SERVICE_LAYER_URL}/${process.env.NEXT_PUBLIC_ODATA_VERSION}`;

// Config formidable để không tự động parse body
export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    try {
      const cookies = req.headers.cookie || '';

      // Đường dẫn tệp ảnh muốn upload
      // const filePath = 'C:\\Users\\anguy\\Downloads\\output-onlinefiletools.txt';

      // Kiểm tra tệp có tồn tại không
      // if (!fs.existsSync(filePath)) {
      //   throw new Error('File không tồn tại ở đường dẫn được cung cấp.');
      // }

      // const file = await createReadStream(filePath);

      // Chuẩn bị formData để gửi đến API phía sau
      // const filePath = 'C:/Users/anguy/Downloads/output-onlinefiletools.txt';
      // Create a new FormData object
      // const formData = new FormData();

      // Attach file from the path
      // const file = await fileFromPath(filePath);
      
      const file = new File(["My hovercraft is full of eels"], "file.txt")
      console.log("Ra file: ", file)



      // Create a new FormData object
      // console.log("bị khùm: ", file)
      const formData = new FormData();
      formData.set("files", file)
      // formData.set("greeting", "Hello, World!")

      for (const [key, value] of formData) {
        console.log(`${key}: ${value.name || value}`);
      }

      // Attach the file (Blob object) to the FormData object
      // formData.append('files', file, 'hello.txt');

      // Đính kèm file từ đường dẫn cố định
      // const fileStream = fs.createReadStream(filePath);
      // console.log("Lạ 1:", fileStream);

      // formData.append('files', file,
      //    {
      //   // filename: 'Untitled design.png',
      //   filename: 'output-onlinefiletools.txt',
      //   // contentType: 'image/png',
      //   contentType: 'text/plain'
      // }
    // );

      // console.log("Lạ ơi: ", formData);

      // formData.append('files', fileStream, {
      //   filename: 'List of Accounts.xlsx', // Tên tệp
      //   contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // Loại nội dung
      // });

      // Đính kèm trường Override (giá trị mẫu cho thử nghiệm)
      // formData.append('Override', 'Y');

      // // Parse form-data từ request
      const { fields, files } = await parseForm(req);

      // console.log("Received files:", files);

      // // Chuẩn bị formData để gửi đến API phía sau
      // const formData = new FormData();

      // // Đính kèm file từ buffer
      // // Chúng ta sẽ lặp qua từng file nhận được và thêm vào FormData
      // if (files.files) {
      //   for (const file of files.files) {
      //     const fileStream = fs.createReadStream(file.filepath);
      //     const originalFilename = file.originalFilename || 'unknown';

      //     formData.append('files', fileStream, {
      //       filename: originalFilename,
      //       contentType: file.mimetype || 'application/octet-stream'
      //     });
      //   }
      // }

      // // Đính kèm các trường khác nếu có
      // for (const [key, value] of Object.entries(fields)) {
      //   if (Array.isArray(value)) {
      //     formData.append(key, value[0]); // Chỉ lấy phần tử đầu tiên trong mảng nếu có
      //   } else {
      //     formData.append(key, value);
      //   }
      // }

      const encoder = new FormDataEncoder(formData);

      // const options = {
      //   method: 'POST',
      //   headers: {
      //     'Cookie': cookies,
      //     ...encoder.headers // Bao gồm Content-Type và Boundary từ encoder
      //   },
      //   body: formData
      //   // body: encoder.encode() // Sử dụng phương thức encode() để chuyển đổi thành stream
      // };

      // const response = await fetch(`${baseURL}/Attachments2`, options);

      const response = await axios.post(`${baseURL}/Attachments2`, req, {
        // responseType: "stream",
        headers: {
          "Content-Type": req.headers["content-type"], // which is multipart/form-data with boundary included
          'Cookie': cookies
        },
      });

      console.log("Bị gì: ", response);
      response.data.pipe(res);


      // const data = await response.json();

      // const response = await purchaseApi.uploadAttachment(formData, cookies);

      // const data = await response.json();
      console.log("Response data: ", data);

      // res.status(response.status).json(data);
    } catch (error) {
      console.error('Error uploading file:', error.response.data);
      res.status(500).json({ message: error.message, value: error.response.data });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
