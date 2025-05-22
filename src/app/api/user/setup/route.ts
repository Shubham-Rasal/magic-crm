import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// In a real application, you would use a database to store user preferences
// This is a mock implementation using server memory for demo purposes
const userSetups = new Map();

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;

    console.log("User ID from session:", userId);
    
    // Parse the incoming data
    const data = await request.json();
    
    // Log the data being received
    console.log("User setup data received:", data);
    
    // Validate required fields with more descriptive error messages
    const missingFields = [];
    if (!data.companyName) missingFields.push('companyName');
    if (!data.industry) missingFields.push('industry');
    if (!data.role) missingFields.push('role');
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Store user setup preferences
    // In a real app, you would save this to a database
    userSetups.set(userId, {
      ...data,
      setupComplete: true,
      createdAt: new Date().toISOString(),
    });
    
    // Log success
    console.log(`Setup completed successfully for user: ${userId}`);
    
    return NextResponse.json(
      { success: true, message: "Setup completed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in user setup API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get user setup data
    const setupData = userSetups.get(userId) || { setupComplete: false };
    
    return NextResponse.json(setupData, { status: 200 });
  } catch (error) {
    console.error("Error in user setup API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
