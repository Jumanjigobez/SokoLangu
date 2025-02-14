import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

const Sidebar = () => {
  const navigate = useNavigate();
  const menuOpened = useSelector((state) => state.MenuReducer);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialogPolicy = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className={menuOpened ? "sidebar" : "sidebar closed"}>
        <div className="logo_part">
          <img src="../images/logo.png" alt="SokoLangu" />
        </div>

        <div className="menu_part">
          <nav>
            <ul>
              <li>
                <NavLink to="/farmerHome" activeClassName="active" title="Home">
                  <i className="fa-solid fa-house-user"></i> <span>Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/products"
                  activeClassName="active"
                  title="Products"
                >
                  <i class="fa-solid fa-apple-alt"></i> <span>Products</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/orders"
                  activeClassName="active"
                  title="Orders"
                >
                  <i class="fa-solid fa-cubes"></i> <span>Orders</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/messagesFarmer"
                  activeClassName="active"
                  title="Messages"
                >
                  <i class="fa-solid fa-comment-dots"></i> <span>Messages</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/settings"
                  activeClassName="active"
                  title="Settings"
                >
                  <i class="fa-solid fa-user-gear"></i> <span>Settings</span>
                </NavLink>
              </li>


            </ul>
          </nav>
        </div>

        <div className="coder_part">
          <div className='part_1'>
            <small>Copyright &copy; 2025 | Coded by <a href='https://jumanjigobez.github.io/personal_portfolio' target='_blank'>Jumanji</a></small>
          </div>

          <div className='part_2'>
            <small>
              <a href="#" onClick={(e) => { e.preventDefault(); openDialogPolicy(); }}>Terms</a> and
              <a href="#" onClick={(e) => { e.preventDefault(); openDialogPolicy(); }} target='_blank'>Privacy Policy</a>
            </small>

          </div>
        </div>
      </div>

      {
        isDialogOpen && (
          <div className="dialog_container">
            <div className="dialog_box policy_dialog">
              <div className="close_part">
                <button
                  className="btn close_btn"
                  onClick={() => setIsDialogOpen(false)}
                >
                  X
                </button>
              </div>

              <div className="title_part">
                <h2>SokoLangu - Terms & Privacy Policy</h2>
              </div>

              <div className="content_part">
                <div className="part_1">
                  <h3>Terms of Service</h3>
                  <p>
                    Welcome to SokoLangu! By registering and using our services, you
                    agree to the following terms:
                  </p>
                  <ol>
                    <li>
                      <strong>User Account:</strong> You are responsible for
                      maintaining the confidentiality of your username and password. Any
                      activity performed through your account is your responsibility.
                    </li>
                    <li>
                      <strong>User Conduct:</strong> You agree to use SokoLangu for
                      lawful purposes only. Any fraudulent, misleading, or harmful
                      activity is strictly prohibited.
                    </li>
                    <li>
                      <strong>Marketplace Transactions:</strong> SokoLangu provides a
                      platform for market trade interactions. We do not guarantee or
                      oversee individual transactions between users.
                    </li>
                    <li>
                      <strong>Data Security:</strong> We implement security measures to
                      protect user data, but we cannot guarantee absolute protection.
                      Report any unauthorized account activity immediately.
                    </li>
                    <li>
                      <strong>Service Availability:</strong> While we aim to maintain
                      uninterrupted service, periodic maintenance or updates may occur.
                      We will communicate planned service interruptions where possible.
                    </li>
                    <li>
                      <strong>Termination of Account:</strong> We reserve the right to
                      suspend or terminate accounts involved in violations of these terms,
                      fraud, or misuse of the platform.
                    </li>
                    <li>
                      <strong>Changes to Terms:</strong> We may revise these terms from
                      time to time. Continued use of SokoLangu signifies agreement with
                      the updated terms.
                    </li>
                  </ol>
                </div>

                <div className="part_2">
                  <h3>Privacy Policy</h3>
                  <p>
                    At SokoLangu, we value and respect your privacy. This policy outlines
                    how we handle your personal data:
                  </p>
                  <ol>
                    <li>
                      <strong>Information Collection:</strong> We collect your username,
                      email, and password for account registration. Additional marketplace
                      data may be gathered to enhance your user experience.
                    </li>
                    <li>
                      <strong>Data Usage:</strong> Your personal information is used solely
                      for providing and improving SokoLangu services. We do not sell or
                      share your information with third parties.
                    </li>
                    <li>
                      <strong>Data Security:</strong> We employ industry-standard security
                      measures to protect your data from unauthorized access or misuse.
                    </li>
                    <li>
                      <strong>Cookies:</strong> SokoLangu may use cookies to enhance your
                      experience. You may modify your browser settings to disable cookies.
                    </li>
                    <li>
                      <strong>Third-party Links:</strong> Our platform may contain links to
                      external sites. We are not responsible for the privacy policies of
                      third-party services.
                    </li>
                    <li>
                      <strong>Children’s Privacy:</strong> SokoLangu is not intended for users
                      under 13. We do not knowingly collect data from minors.
                    </li>
                    <li>
                      <strong>Policy Updates:</strong> We may update this policy periodically.
                      Significant changes will be communicated to users.
                    </li>
                  </ol>
                </div>

                <div className="part_3">
                  <p>
                    For any questions or concerns about our terms or privacy policy,
                    please contact us at{" "}
                    <a href="mailto:jumagobe3@gmail.com">jumagobe3@gmail.com</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      }
    </>
  );

};

export default Sidebar;
