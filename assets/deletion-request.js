(() => {
  const supabaseUrl = "https://ohvtqsjyvfctjapqpbtf.supabase.co";
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odnRxc2p5dmZjdGphcHFwYnRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MjI0MzMsImV4cCI6MjA3NDI5ODQzM30.eFZ2PzJP_DUJ9v1bwByJeIpAeafsTOYcRPjU2w1g4Ic";
  const client = window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
    auth: { flowType: "pkce", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });

  const status = document.getElementById("auth-status");
  const signInPanel = document.getElementById("sign-in-panel");
  const signInButton = document.getElementById("google-sign-in");
  const form = document.getElementById("request-form");
  const emailInput = document.getElementById("account-email");
  const sendButton = document.getElementById("send-request");
  const switchButton = document.getElementById("switch-account");
  const reasonInput = document.getElementById("reason");
  const success = document.getElementById("request-success");

  const setStatus = (message, kind = "") => {
    status.textContent = message;
    status.className = `notice${kind ? ` ${kind}` : ""}`;
    status.hidden = !message;
  };

  const isVerifiedGoogleUser = (user) => Boolean(
    user?.email
      && user.email_confirmed_at
      && (user.app_metadata?.provider === "google" || user.identities?.some((identity) => identity.provider === "google")),
  );

  const showUser = (user) => {
    const verified = isVerifiedGoogleUser(user);
    signInPanel.hidden = verified;
    form.hidden = !verified;
    if (verified) {
      emailInput.value = user.email;
      setStatus(`Verified Google account: ${user.email}`);
    } else {
      emailInput.value = "";
      setStatus(user ? "This account is not a verified Google account. Continue with Google to select your Bridge account." : "Sign in with the Google account connected to Bridge to verify account ownership.");
    }
  };

  const startGoogleSignIn = async () => {
    signInButton.disabled = true;
    setStatus("Opening Google sign-in…");
    try {
      const redirectTo = `${window.location.origin}${window.location.pathname}`;
      const { error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo, queryParams: { prompt: "select_account" } },
      });
      if (error) throw error;
    } catch {
      setStatus("Google sign-in could not be started. Please try again or contact atlasthoughthelp@gmail.com.", "error");
      signInButton.disabled = false;
    }
  };

  signInButton.addEventListener("click", () => { void startGoogleSignIn(); });
  switchButton.addEventListener("click", async () => {
    await client.auth.signOut({ scope: "local" });
    showUser(null);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    sendButton.disabled = true;
    setStatus("Sending your request…");
    const { error } = await client.functions.invoke("request-account-deletion", {
      body: { reason: reasonInput.value.trim() },
    });
    if (error) {
      const statusCode = error.context?.status;
      setStatus(statusCode === 401
        ? "Your Google sign-in expired. Please sign in again to verify ownership."
        : statusCode === 429
          ? "A deletion request was already submitted for this account recently. Contact support if you need help."
          : "We couldn't submit your request. Check your connection and try again, or email atlasthoughthelp@gmail.com.", "error");
      if (statusCode === 401) showUser(null);
      sendButton.disabled = false;
      return;
    }
    form.hidden = true;
    signInPanel.hidden = true;
    status.hidden = true;
    success.hidden = false;
  });

  client.auth.onAuthStateChange((_event, session) => showUser(session?.user ?? null));
  client.auth.getSession().then(({ data: { session }, error }) => {
    if (error) setStatus("We could not check your sign-in. Reload the page or contact support.", "error");
    else showUser(session?.user ?? null);
  });
})();
