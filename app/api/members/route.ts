import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/db';
import Member from '@/models/Member';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

        // Protect this route too? Maybe only admins can see full member list?
        // For now, let's say admin only.
        const headersList = await headers();
        const cookieHeader = headersList.get('cookie');
        const token = cookieHeader?.split('token=')[1]?.split(';')[0];

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden: Admin only' }, { status: 403 });
        }

        const members = await Member.find({}).sort({ name: 1 });
        return NextResponse.json({ members }, { status: 200 });
    } catch (error) {
        console.error('Fetch members error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        const headersList = await headers();
        const cookieHeader = headersList.get('cookie');
        const token = cookieHeader?.split('token=')[1]?.split(';')[0];

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden: Admin only' }, { status: 403 });
        }

        const { name, email, phoneNumber, status } = await request.json();

        if (!name || !email) {
            return NextResponse.json({ message: 'Please provide name and email' }, { status: 400 });
        }

        const existingMember = await Member.findOne({ email });
        if (existingMember) {
            return NextResponse.json({ message: 'Member already exists' }, { status: 400 });
        }

        const member = await Member.create({
            name,
            email,
            phoneNumber,
            status,
        });

        return NextResponse.json({ message: 'Member added', member }, { status: 201 });
    } catch (error) {
        console.error('Create member error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
