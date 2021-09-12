import React from "react";
import { Link } from "react-router-dom";
import "./style.scss";
import SleepImg from "../../../../assets/images/sleep.png";
import AddNow from "../../../../assets/images/addnew/addnewbtn.PNG";
import PopUp from "../../../../assets/images/addnew/popup.PNG";
import PopUpAddNow from "../../../../assets/images/addnew/popupaddnew.PNG";
import Table from "../../../../assets/images/tracking/table.PNG";
import Graph from "../../../../assets/images/tracking/graph.PNG";
import Info from "../../../../assets/images/tracking/info.PNG";
import { Image } from "antd";

export default function Landing() {
  return (
    <div className="_landing">
      <section className="_intro">
        <div className="_content">
          <h3>Introdution</h3>
          <p>
            Sleep is the platform on which nutrition, exercise and mindfulness
            reside, most of us needing 7 to 9 hours each night to recover and
            restore.
          </p>
          <p>
            Sleep Tracker helps you to better health through better sleep. At
            its heart, it tracks your sleep quality by analyze the information
            you provided.
          </p>
          <Link to="/auth/register">Register now!</Link>
        </div>
        <div className="_image">
          <img src={SleepImg} alt="sleep-img" />
        </div>
      </section>
      <h2>How it's easy ?</h2>
      <section className="_add _howToUse">
        <h4>Add new record</h4>
        <div className="_images">
          <div className="_imgItem">
            <Image src={AddNow} />
            <p>Hit the "+ New entry" button.</p>
          </div>
          <div className="_imgItem">
            <Image src={PopUp} />
            <p>Fill some infomation.</p>
          </div>
          <div className="_imgItem">
            <Image src={PopUpAddNow} />
            <p>Just "Add now".</p>
          </div>
        </div>
      </section>
      <section className="_tracking _howToUse">
        <h4>Tracking</h4>
        <div className="_images">
          <div className="_imgItem">
            <Image src={Table} />
            <p>Table</p>
          </div>
          <div className="_imgItem">
            <Image src={Graph} />
            <p>Graph</p>
          </div>
          <div className="_imgItem">
            <Image src={Info} />
            <p>More infomation</p>
          </div>
        </div>
      </section>
    </div>
  );
}
