const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Placeholder for sending an invitation email.
 * This would be triggered via an HTTPS call from the admin UI.
 * It would generate a unique token, store it in the 'invites' collection,
 * and use a third-party email service (like SendGrid or Nodemailer) to send the link.
 */
exports.sendInviteEmail = functions.https.onCall(async (data, context) => {
  // TODO: Before calling, update rules to allow admins to invoke this function.
  // For now, checking for auth is sufficient.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  // A more robust check for admin privileges:
  const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
  if (!userDoc.exists || !userDoc.data().isAdmin) {
      throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can send invites."
    );
  }

  const email = data.email;
  // In a real app, use the crypto module for a secure random token.
  const uniqueToken = admin.firestore().collection('invites').doc().id;

  // Save invite to Firestore with an expiration date.
  await admin.firestore().collection("invites").doc(uniqueToken).set({
    email: email,
    used: false,
    expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)), // 24 hours
  });

  // TODO: Integrate a real email service here (e.g., using Nodemailer with SMTP or an API like SendGrid).
  // The email should contain a link like: https://<your-public-site-domain>/register?token=...
  console.log(`TODO: Send email to ${email} with registration link containing token: ${uniqueToken}`);

  return { success: true, message: `Invite sent to ${email}.` };
});
