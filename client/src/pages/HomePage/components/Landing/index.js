import React from "react";
import { Link } from "react-router-dom";
import "./style.scss";
import SleepImg from "../../../../assets/images/sleep.png";
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
          <Link to="/auth">Register now!</Link>
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
            <Image src={SleepImg} />
            <p>Hit the "+ New entry" button.</p>
          </div>
          <div className="_imgItem">
            <Image src={SleepImg} />
            <p>Fill some infomation.</p>
          </div>
          <div className="_imgItem">
            <Image src={SleepImg} />
            <p>Just "Add now".</p>
          </div>
        </div>
      </section>
      <section className="_tracking _howToUse">
        <h4>Tracking</h4>
        <div className="_images">
          <div className="_imgItem">
            <Image src={SleepImg} />
            <p>Table</p>
          </div>
          <div className="_imgItem">
            <Image src={SleepImg} />
            <p>Graph</p>
          </div>
          <div className="_imgItem">
            <Image src={SleepImg} />
            <p>More infomation</p>
          </div>
        </div>
      </section>
    </div>
  );
}
