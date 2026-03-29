import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  } catch (err) {
    console.error('Firebase Admin init error', err);
  }
}

export async function POST(req: Request) {
  try {
    const { title, body, topic, urgency } = await req.json();

    if (!admin.apps.length) {
      console.log('Push notification skipped (Admin SDK not configured via service account).');
      return NextResponse.json({ success: true, message: 'Mock sent' });
    }

    const message = {
      notification: {
        title: title || 'New Notice',
        body: body || 'You have a new notice.',
      },
      data: {
        urgency: urgency || 'Normal',
      },
      topic: topic || 'ALL', 
    };

    const response = await admin.messaging().send(message);

    return NextResponse.json({ success: true, response });
  } catch (error: any) {
    console.error('Error sending push notification:', error);
    // Return 200 anyway so the Admin app doesn't crash during hackathon demo
    return NextResponse.json({ success: false, error: error.message });
  }
}
