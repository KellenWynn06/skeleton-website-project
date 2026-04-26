import { useEffect, useState } from "react";
import {
  register,
  login,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProfile,
  updateProfile,
} from "./api";
import "./App.css";

function App() {
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [view, setView] = useState("dashboard");

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editProject, setEditProject] = useState({
    name: "",
    status: "",
    budget: 0,
    parts_needed: "",
    notes: "",
  });

  const [profile, setProfile] = useState({
    display_name: "",
    major: "",
    school: "",
    bio: "",
  });

  const [newProject, setNewProject] = useState({
    name: "",
    status: "Planning",
    budget: 0,
    parts_needed: "",
    notes: "",
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      loadProjects(token);
      loadProfile(token);
    }
  }, [token]);

  async function handleRegister() {
    try {
      await register(email, password);
      const data = await login(email, password);

      setToken(data.access_token);
      setError("");
      setEmail("");
      setPassword("");
    } catch {
      setError("Register failed");
    }
  }

  async function handleLogin() {
    try {
      const data = await login(email, password);
      setToken(data.access_token);
      setError("");
      setEmail("");
      setPassword("");
    } catch {
      setError("Login failed");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken("");
    setProjects([]);
    setError("");
    setEditingProjectId(null);
  }

  async function loadProjects(activeToken = token) {
    try {
      const data = await getProjects(activeToken);
      setProjects(data);
      setError("");
    } catch {
      setError("Failed to load projects");
    }
  }

  async function loadProfile(activeToken = token) {
    try {
      const data = await getProfile(activeToken);
      setProfile(data);
    } catch {
      setError("Failed to load profile");
    }
  }

  async function handleCreateProject(e) {
    e.preventDefault();

    try {
      await createProject(token, {
        ...newProject,
        budget: Number(newProject.budget),
      });

      setNewProject({
        name: "",
        status: "Planning",
        budget: 0,
        parts_needed: "",
        notes: "",
      });

      await loadProjects();
      setError("");
    } catch {
      setError("Failed to create project");
    }
  }

  function startEditing(project) {
    setEditingProjectId(project.id);
    setEditProject({
      name: project.name,
      status: project.status,
      budget: project.budget,
      parts_needed: project.parts_needed || "",
      notes: project.notes || "",
    });
  }

  function cancelEditing() {
    setEditingProjectId(null);
    setEditProject({
      name: "",
      status: "",
      budget: 0,
      parts_needed: "",
      notes: "",
    });
  }

  async function handleUpdateProject(projectId) {
    try {
      await updateProject(token, projectId, {
        ...editProject,
        budget: Number(editProject.budget),
      });

      setEditingProjectId(null);
      await loadProjects();
      setError("");
    } catch {
      setError("Failed to update project");
    }
  }

  async function handleDeleteProject(projectId) {
    try {
      await deleteProject(token, projectId);
      await loadProjects();
      setError("");
    } catch {
      setError("Failed to delete project");
    }
  }

  async function handleProfileUpdate(e) {
    e.preventDefault();

    try {
      await updateProfile(token, profile);
      setError("");
    } catch {
      setError("Failed to update profile");
    }
  }

  return (
    <div className="enterprise-app">
      {!token ? (
        <main className="auth-layout">
          <div className="auth-panel">
            <div className="brand-header">
              <div className="logo-geometric"></div>
              <h2>ENGINEERING WORKSPACE</h2>
            </div>
            
            <div className="auth-form">
              <h3>{authMode === "login" ? "System Login" : "Account Registration"}</h3>
              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              {authMode === "login" ? (
                <button className="btn-primary" onClick={handleLogin}>
                  Sign In
                </button>
              ) : (
                <button className="btn-primary" onClick={handleRegister}>
                  Create Account
                </button>
              )}

              <button
                className="btn-text"
                onClick={() => {
                  setAuthMode(authMode === "login" ? "register" : "login");
                  setError("");
                }}
              >
                {authMode === "login"
                  ? "Don't have an account? Register"
                  : "Return to Sign In"}
              </button>

              {error && <div className="alert-error">{error}</div>}
            </div>
          </div>
        </main>
      ) : (
        <div className="workspace-layout">
          {/* Sidebar Navigation */}
          <aside className="workspace-sidebar">
            <div className="brand-header compact">
              <div className="logo-geometric small"></div>
              <h2>ENG WORKSPACE</h2>
            </div>

            <nav className="sidebar-nav">
              <button 
                className={view === "dashboard" ? "active" : ""} 
                onClick={() => setView("dashboard")}
              >
                Project Dashboard
              </button>
              <button 
                className={view === "profile" ? "active" : ""} 
                onClick={() => setView("profile")}
              >
                User Profile
              </button>
            </nav>

            <div className="sidebar-footer">
              <div className="user-status">
                <span className="status-dot"></span>
                Connected
              </div>
              <button className="btn-secondary" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="workspace-main">
            <header className="workspace-header">
              <h1>{view === 'dashboard' ? 'Project Dashboard' : 'User Profile'}</h1>
            </header>

            <div className="workspace-content">
              {error && <div className="alert-error">{error}</div>}

              {view === "dashboard" && (
                <>
                  <section className="panel new-project-panel">
                    <h3>Create New Project</h3>
                    <form onSubmit={handleCreateProject}>
                      <div className="form-grid-3">
                        <div className="input-group">
                          <label>Project Name *</label>
                          <input
                            value={newProject.name}
                            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="input-group">
                          <label>Status</label>
                          <input
                            value={newProject.status}
                            onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                          />
                        </div>
                        <div className="input-group">
                          <label>Budget ($)</label>
                          <input
                            type="number"
                            value={newProject.budget}
                            onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="form-grid-2">
                        <div className="input-group">
                          <label>Required Parts & Materials</label>
                          <textarea
                            value={newProject.parts_needed}
                            onChange={(e) => setNewProject({ ...newProject, parts_needed: e.target.value })}
                          />
                        </div>
                        <div className="input-group">
                          <label>Engineering Notes</label>
                          <textarea
                            value={newProject.notes}
                            onChange={(e) => setNewProject({ ...newProject, notes: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="panel-actions">
                        <button className="btn-primary" type="submit">Save Project</button>
                      </div>
                    </form>
                  </section>

                  <div className="data-grid">
                    {projects.map((p) => (
                      <article className="data-card" key={p.id}>
                        {editingProjectId === p.id ? (
                          <div className="edit-form">
                            <div className="input-group">
                              <label>Project Name</label>
                              <input
                                value={editProject.name}
                                onChange={(e) => setEditProject({ ...editProject, name: e.target.value })}
                              />
                            </div>
                            <div className="form-grid-2">
                              <div className="input-group">
                                <label>Status</label>
                                <input
                                  value={editProject.status}
                                  onChange={(e) => setEditProject({ ...editProject, status: e.target.value })}
                                />
                              </div>
                              <div className="input-group">
                                <label>Budget</label>
                                <input
                                  type="number"
                                  value={editProject.budget}
                                  onChange={(e) => setEditProject({ ...editProject, budget: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="input-group">
                              <label>Parts Needed</label>
                              <textarea
                                value={editProject.parts_needed}
                                onChange={(e) => setEditProject({ ...editProject, parts_needed: e.target.value })}
                              />
                            </div>
                            <div className="input-group">
                              <label>Notes</label>
                              <textarea
                                value={editProject.notes}
                                onChange={(e) => setEditProject({ ...editProject, notes: e.target.value })}
                              />
                            </div>
                            <div className="card-actions">
                              <button className="btn-primary" onClick={() => handleUpdateProject(p.id)}>Save Changes</button>
                              <button className="btn-secondary" onClick={cancelEditing}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="card-header">
                              <h4>{p.name}</h4>
                              <span className="badge-status">{p.status || "Unspecified"}</span>
                            </div>
                            <div className="card-body">
                              <div className="data-row">
                                <span>Budget</span>
                                <strong>${p.budget}</strong>
                              </div>
                              <div className="data-row stack">
                                <span>Parts & Materials</span>
                                <p>{p.parts_needed || "N/A"}</p>
                              </div>
                              <div className="data-row stack">
                                <span>Notes</span>
                                <p>{p.notes || "None"}</p>
                              </div>
                            </div>
                            <div className="card-actions border-top">
                              <button className="btn-secondary" onClick={() => startEditing(p)}>Edit</button>
                              <button className="btn-danger" onClick={() => handleDeleteProject(p.id)}>Delete</button>
                            </div>
                          </>
                        )}
                      </article>
                    ))}
                  </div>
                </>
              )}

              {view === "profile" && (
                <section className="panel">
                  <h3>User Profile</h3>
                  <form onSubmit={handleProfileUpdate} className="profile-form">
                    <div className="form-grid-2">
                      <div className="input-group">
                        <label>Display Name</label>
                        <input
                          value={profile.display_name}
                          onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                        />
                      </div>
                      <div className="input-group">
                        <label>Major / Discipline</label>
                        <input
                          value={profile.major}
                          onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Institution / Organization</label>
                      <input
                        value={profile.school}
                        onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label>Biography</label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      />
                    </div>
                    <div className="panel-actions">
                      <button className="btn-primary" type="submit">Save Profile</button>
                    </div>
                  </form>
                </section>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;