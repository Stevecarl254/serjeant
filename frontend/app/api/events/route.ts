import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/db';
import Event from '@/models/Event';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper to verify token
const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    } catch (error) {
        return null;
    }
};

export async function GET() {
    try {
        await connectToDatabase();
        const events = await Event.find({}).sort({ date: 1 }).populate('createdBy', 'name');
        return NextResponse.json({ events }, { status: 200 });
    } catch (error) {
        console.error('Fetch events error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        // Get token from cookie or header
        const headersList = await headers();
        const cookieHeader = headersList.get('cookie');
        const token = cookieHeader?.split('token=')[1]?.split(';')[0]; // Simple parsing, better to use a library or proper middleware

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden: Admin only' }, { status: 403 });
        }

        const { title, description, date, location } = await request.json();

        if (!title || !description || !date || !location) {
            return NextResponse.json({ message: 'Please provide all required fields' }, { status: 400 });
        }

        const event = await Event.create({
            title,
            description,
            date,
            location,
            createdBy: decoded.userId,
        });

        return NextResponse.json({ message: 'Event created', event }, { status: 201 });
    } catch (error) {
        console.error('Create event error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
