rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr3rrrrrrrrrrrrrrrrrrrrrrrrrrr3rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr333333rrrrrrrrrrrrrrrrrrrrrrrrrr33333333333rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr3rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr333333333rrrrrrrrrrrrrrrrrrrrr3333rrrrrrrrrrrrrrrrrrrrrrrrr33333333333333rrrrrrrrrrrrrrrrrrrrrrr33333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333gtt32ggtgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggrrrrtttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt44tbgggggggggggggggggggggggggggggggggggggggggggggg`  import connectToDatabase from '../lib/db';
import mongoose from 'mongoose';

async function testConnection() {
    console.log('Testing database connection...');
    try {
        await connectToDatabase();
        console.log('✅ Database connection successful!');
        console.log(`Connected to: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('❌ Database connection failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

testConnection();
