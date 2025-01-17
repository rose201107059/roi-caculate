import { processData } from '../../lib/processData';
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    console.log('API route: /api/analyze called');
    const filePath = path.join(process.cwd(), 'public', 'ngl-new.csv');
    console.log('Reading CSV file from:', filePath);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const data = processData(fileContent);

    console.log('Data processed successfully');
    console.log('Total infringing shops:', data.totalInfringingShops);
    console.log('Closed shops:', data.closedShops);
    console.log('Cleared shops:', data.clearedShops);

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in /api/analyze:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}