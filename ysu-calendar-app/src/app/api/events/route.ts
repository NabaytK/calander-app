import { NextResponse } from 'next/server';
import fsPromises from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // Get the path to the events JSON file
    const filePath = path.join(process.cwd(), 'src/data/events.json');
    
    // Read the file
    const fileData = await fsPromises.readFile(filePath, 'utf-8');
    
    // Parse the JSON data
    const events = JSON.parse(fileData);
    
    // Return the events as JSON
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error reading events file:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
