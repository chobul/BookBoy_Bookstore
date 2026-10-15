import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Project CSI206 API',
      version: '1.0.0',
      description: `
        Book Catalog - กลุ่มที่ 40 
        คณะเทคโนโลยีสารสนเทศ สาขาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยศรีปทุม  

        **สมาชิกกลุ่ม**  
        - นายชลกร บัวหลวง (66090864) 
        - นายวิทวัส กุยสิงห์ (66057907)  

        **หมวดหมู่ API ทั้งหมดมีดังนี้**  
        - Address: 4 APIs  
        - Auth: 4 APIs  
        - Books: 7 API  
        - Notification: 4 APIs    
        - Favorites: 4 APIs  
        - Orders: 5 APIs  
        - Payment: 4 APIs
        - Users: 5 APIs
        **รวมทั้งหมด: 37 APIs**   
      `,
    },
    servers: [
      {
        url: process.env.BASE_URL ? `${process.env.BASE_URL}/api` : 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to your route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs, swaggerUi };
