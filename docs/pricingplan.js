import React, { useEffect, useState } from "react";
import "./pricingplan.css";

const PricingPlan = () => {
  const [isFirstYear, setIsFirstYear] = useState(true); // Toggle between 1st Year and Continued Service
  const [descriptionsVisible, setDescriptionsVisible] = useState({}); // Toggle descriptions visibility

  useEffect(() => {
    const handleKeydown = (event) => {
      if (["a", "s"].includes(event.key)) {
        toggleService();
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  const toggleService = () => {
    setIsFirstYear((prev) => !prev);
  };

  const toggleDescription = (id) => {
    setDescriptionsVisible((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="container">

      <header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="switch-section">
          <h6 className="sub-title">
            1st Year
            <label className="switch">
              <input
                type="checkbox"
                onChange={toggleService}
                checked={!isFirstYear}
              />
              <span className="slider round"></span>
            </label>
            after
          </h6>
        </div>
      </header>
      <br />

      <div className="grid-parent">
        {/* First Year Base Subscription */}
        <div className="card basic-card">
          <h4 className="card-title">Site Subscription (per year)</h4>
          {isFirstYear ? (
            <h1 className="price">
              <span>$</span>8000
            </h1>
          ) : (
            <h1 className="price">
              <span>$</span>3000
            </h1>
          )}
          <hr />

          <h5 className="text">
            Content Production: up to XXX Units
            <span
              className="learn-more-icon"
              onClick={() => toggleDescription("contentProductionDesc")}
            ></span>
          </h5>
          {descriptionsVisible["contentProductionDesc"] && (
            <div id="contentProductionDesc" className="description open">
              <p>
                We will produce XXX units of content, each containing up to 15 minutes of video, filmed on
                the customer site, with voice narration and alignment to work instructions.
              </p>
            </div>
          )}
          <hr />

          <h5 className="text">
            Equipment: Kiosk up to 3 sets
            <span
              className="learn-more-icon"
              onClick={() => toggleDescription("equipmentProvisionDesc")}
            ></span>
          </h5>
          {descriptionsVisible["equipmentProvisionDesc"] && (
            <div id="equipmentProvisionDesc" className="description open">
              <p>
                We provide THREE set of Kiosk, installed on-site, including overhead cameras, microscope
                adapter, mounting frame, and Windows Surface tablet. We ensure the functionality of the
                Kiosk.
              </p>
            </div>
          )}
          <hr />

          <h5 className="text">
            Practice Photos: 7 x 24 Availability
            <span
              className="learn-more-icon"
              onClick={() => toggleDescription("practiceMonitoringDesc")}
            ></span>
          </h5>
          {descriptionsVisible["practiceMonitoringDesc"] && (
            <div id="practiceMonitoringDesc" className="description open">
              <p>
                The Kiosk includes a practice monitoring system. Operators save practice photos at each
                step, and management can review submitted photos via email at the end of each session.
              </p>
            </div>
          )}
          <hr />
        </div>

        {/* Add-On Service */}
        <div className="card basic-card">
          <div className="title">
            <h4>Per Enrolled Operator</h4>
          </div>
          {isFirstYear ? (
            <h1 className="price">
              <span>$</span>800
            </h1>
          ) : (
            <h1 className="price">
              <span>$</span>-tbd-
            </h1>
          )}
          <hr />

          <h5 className="text">
            Guarrantee pass, or unlimited access
            <span
              className="learn-more-icon"
              onClick={() => toggleDescription("broadcastStartDesc")}
            ></span>
          </h5>
          {descriptionsVisible["broadcastStartDesc"] && (
            <div id="broadcastStartDesc" className="description open">
              <p>
                xxxx
              </p>
            </div>
          )}
          <hr />
        </div>
      </div>
    </div>
  );
};

export default PricingPlan;