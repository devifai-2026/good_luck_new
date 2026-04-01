export const prepareAstrologerCallDetails = (data: any) => {
    if (!data) {
        console.error("❌ No data provided for astrologer call preparation");
        return null;
    }

    console.log("🔍 RAW Astrologer Data for preparation:", JSON.stringify(data, null, 2));

    // 🔥 CRITICAL: Extract correct UIDs
    const astrologerUid = data.astrologerUid;
    let userUid = data.userUid;

    // Validation
    if (!astrologerUid) {
        console.error("❌ MISSING astrologerUid in astrologer data");
        return null;
    }

    if (!userUid) {
        console.error("❌ MISSING userUid in astrologer data");
        return null;
    }

    // Check if UIDs are confused
    if (astrologerUid === userUid) {
        console.warn("⚠️ UID CONFLICT: astrologerUid and userUid are same!");
        // Try to find correct userUid from other fields
        const possibleUserUid = data.originalUserUid || data.finalUserUid;
        if (possibleUserUid && possibleUserUid !== astrologerUid) {
            console.log("🔧 Using alternative userUid:", possibleUserUid);
            userUid = possibleUserUid;
        }
    }

    const callDetails = {
        appId: data.appId || "c2d5a4535c454c269d18721d8dde17f1",
        channelName: data.channelName,
        clientToken: data.clientToken, // Astrologer's token
        astrologerUid: astrologerUid, // ✅ Should be 86014
        userUid: userUid, // ✅ Should be 2230
        callType: data.callType,
        requestId: data.requestId,
        astrologerId: data.astrologerId,
        userId: data.userId
    };

    console.log("🎯 PREPARED Astrologer Call Details:", {
        astrologerUid: callDetails.astrologerUid,
        userUid: callDetails.userUid,
        channel: callDetails.channelName,
        tokenExists: !!callDetails.clientToken
    });

    return callDetails;
};

export const prepareUserCallDetails = (data: any) => {
    if (!data) {
        console.error("❌ No data provided for user call preparation");
        return null;
    }

    console.log("🔍 RAW User Data for preparation:", JSON.stringify(data, null, 2));

    // Extract UIDs
    const userUid = data.userUid;
    let astrologerUid = data.astrologerUid;

    // Validation
    if (!userUid) {
        console.error("❌ MISSING userUid in user data");
        return null;
    }

    // If astrologerUid is missing, use fallback
    if (!astrologerUid) {
        console.warn("⚠️ astrologerUid missing in user data, using fallback");
        astrologerUid = 50000 + Math.floor(Math.random() * 10000);
        console.log("🔧 Fallback astrologerUid generated:", astrologerUid);
    }

    const callDetails = {
        appId: data.appId || "c2d5a4535c454c269d18721d8dde17f1",
        channelName: data.channelName,
        clientToken: data.clientToken, // User's token
        userUid: userUid, // ✅ Should be 2230
        astrologerUid: astrologerUid, // ✅ Should be 86014 (or fallback)
        callType: data.callType,
        requestId: data.requestId,
        astrologerId: data.astrologerId,
        userId: data.userId
    };

    console.log("🎯 PREPARED User Call Details:", {
        userUid: callDetails.userUid,
        astrologerUid: callDetails.astrologerUid,
        channel: callDetails.channelName,
        tokenExists: !!callDetails.clientToken
    });

    return callDetails;
};