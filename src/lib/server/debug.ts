// src/lib/server/debug.ts
import fs from 'node:fs';
import path from 'node:path';

/**
 * Ghi data ra file (ghi đè).
 * @param fileName Tên file (ví dụ: 'debug-tweets.json')
 * @param data Dữ liệu cần log (Object, Array, String...)
 */
export function logData(fileName: string, data: any) {
    try {
        // Đường dẫn lưu file (lưu ngay tại root dự án để dễ tìm)
        const filePath = path.resolve(process.cwd(), fileName);
        
        // Convert data sang JSON string cho dễ đọc
        const content = typeof data === 'string' 
            ? data 
            : JSON.stringify(data, null, 2);

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ [DEBUG] Đã ghi đè dữ liệu vào: ${filePath}`);
    } catch (error) {
        console.error('❌ [DEBUG] Lỗi ghi file:', error);
    }
}
