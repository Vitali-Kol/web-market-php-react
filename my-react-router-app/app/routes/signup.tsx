import { Link } from "react-router";
import { useState } from "react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    retype: "",
  });
  const [message, setMessage] = useState("");
  const [show, setShow] = useState<{ p1: boolean; p2: boolean }>({ p1: false, p2: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.retype) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost/server/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        setMessage(`Server error: ${res.status}`);
        return;
      }

      let data: { status: string; message: string } = { status: "error", message: "Invalid server response" };
      
      try {
        data = await res.json();
      } catch {
        setMessage("Server returned invalid JSON");
        return;
      }

      setMessage(data.message || "Unknown response");
    } catch (err) {
      console.error(err);
      setMessage("Failed to connect to server");
    }
  };
  return (
    <main className="min-h-[calc(100vh-65px)] grid place-items-center px-4">
      <div className="w-full max-w-md bg-white/70 backdrop-blur rounded-xl border border-black/10 p-6 sm:p-8">
        <h1 className="text-3xl font-semibold text-center">Create Your Account</h1>
        <p className="text-center text-sm text-black/60 mt-1">Please enter your details</p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label className="text-sm">Name</label>
            <input
              type="text"
              name="username"
              required
              placeholder="Enter your name"
              value={formData.username}
              onChange={handleChange}
              className="w-full h-11 px-3 rounded-md border border-black/15 outline-none focus:ring-2 ring-black/20 bg-white"
            />
          </div>

          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-11 px-3 rounded-md border border-black/15 outline-none focus:ring-2 ring-black/20 bg-white"
            />
          </div>

          <div>
            <label className="text-sm">Password</label>
            <div className="relative">
              <input
                type={show.p1 ? "text" : "password"}
                name="password"
                required
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-11 px-3 pr-10 rounded-md border border-black/15 outline-none focus:ring-2 ring-black/20 bg-white"
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, p1: !s.p1 }))}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded bg-black/5 hover:bg-black/10"
              >
                {show.p1 ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm">Retype Password</label>
            <div className="relative">
              <input
                type={show.p2 ? "text" : "password"}
                name="retype"
                required
                placeholder="Retype password"
                value={formData.retype}
                onChange={handleChange}
                className="w-full h-11 px-3 pr-10 rounded-md border border-black/15 outline-none focus:ring-2 ring-black/20 bg-white"
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, p2: !s.p2 }))}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded bg-black/5 hover:bg-black/10"
              >
                {show.p2 ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full h-11 rounded-md bg-black text-white hover:opacity-90 transition">
            Sign up
          </button>
        </form>

        {message && <p className="text-center text-sm mt-4 text-black/70">{message}</p>}

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="underline underline-offset-4 hover:opacity-80">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
