import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import {
  createEntry,
  deleteEntry,
  getEntries,
  updateEntry,
} from "../../../../actions/entries";
import "./style.scss";

import {
  Table,
  Modal,
  Radio,
  DatePicker,
  Space,
  TimePicker,
  message,
} from "antd";
import { Popconfirm } from "antd";
import moment from "moment";
const { Column } = Table;

export default function Home() {
  let data = [];

  const initialNewFormState = {
    date: moment().format("DD/MM/YYYY"),
    sleepTime: "00:00",
    wakeUpTime: "00:00",
    sleepDuration: "0h",
  };

  let initialEditFormState = {
    date: "",
    sleepTime: "",
    wakeUpTime: "",
    sleepDuration: "",
  };

  const entries = useSelector((state) => state.entry);
  data = entries;

  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [timeLine, setTimeLine] = useState("day");
  const newEntryForm = useRef(initialNewFormState);
  const editEntryForm = useRef(initialEditFormState);
  const currentEditEntryForm = useRef(initialEditFormState);

  useEffect(() => {
    dispatch(getEntries());
  }, [dispatch]);

  const handleChangeNewDate = (date, dateString) => {
    newEntryForm.current = { ...newEntryForm.current, date: dateString };
  };
  const handleChangeNewSleepTime = (time, timeString) => {
    //conut sleepDuration
    const sleepDuration = countSleepDuration(
      timeString,
      newEntryForm.current.wakeUpTime
    );
    newEntryForm.current = {
      ...newEntryForm.current,
      sleepTime: timeString,
      sleepDuration,
    };
  };
  const handleChangeNewWakeUpTime = (time, timeString) => {
    //conut sleepDuration
    const sleepDuration = countSleepDuration(
      newEntryForm.current.sleepTime,
      timeString
    );
    newEntryForm.current = {
      ...newEntryForm.current,
      wakeUpTime: timeString,
      sleepDuration,
    };
  };

  const handleChangeEditDate = (date, dateString) => {
    editEntryForm.current = { ...editEntryForm.current, date: dateString };
  };
  const handleChangeEditSleepTime = (time, timeString) => {
    //conut sleepDuration
    const sleepDuration = countSleepDuration(
      timeString,
      editEntryForm.current.wakeUpTime
    );
    editEntryForm.current = {
      ...editEntryForm.current,
      sleepTime: timeString,
      sleepDuration,
    };
  };
  const handleChangeEditWakeUpTime = (time, timeString) => {
    //conut sleepDuration
    const sleepDuration = countSleepDuration(
      editEntryForm.current.sleepTime,
      timeString
    );
    editEntryForm.current = {
      ...editEntryForm.current,
      wakeUpTime: timeString,
      sleepDuration,
    };

    let dateParts = editEntryForm.current.date.split("/");
    let momentObj = moment(
      new Date(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`)
    ).format("DD/MM/YYYY");

    let date = document
      .getElementsByClassName("_editEntryDateValue")[0]
      .getElementsByTagName("input")[0];
    date.value = momentObj;
    date.title = momentObj;
    date.defaultValue = momentObj;
  };

  const countSleepDuration = (sleepTime, wakeUpTime) => {
    let sleepHour = getHour(sleepTime);
    let sleepMinute = getMinute(sleepTime);
    let wakeUpHour = getHour(wakeUpTime);
    let wakeUpMinute = getMinute(wakeUpTime);

    let hour = 0;
    let minute = 0;
    if (wakeUpHour >= sleepHour) hour = wakeUpHour - sleepHour;
    if (wakeUpHour < sleepHour) hour = 24 - sleepHour + wakeUpHour;
    if (wakeUpMinute >= sleepMinute) minute = wakeUpMinute - sleepMinute;
    if (wakeUpMinute < sleepMinute) minute = 60 - sleepMinute + wakeUpMinute;

    if (hour === 0 && wakeUpMinute < sleepMinute) {
      return null;
    }

    return hour * 60 + minute;
  };

  const getHour = (timeString) => {
    let hourStr = timeString.split(":")[0];
    return parseInt(hourStr);
  };
  const getMinute = (timeString) => {
    let minuteStr = timeString.split(":")[1];
    return parseInt(minuteStr);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalAdd = (e) => {
    if (newEntryForm.current.sleepDuration) {
      e.preventDefault();
      // action newEntry
      dispatch(createEntry(newEntryForm.current));
      setIsModalVisible(false);
      message.success("Entry has been added!");
      newEntryForm.current = initialNewFormState;
    } else {
      e.preventDefault();
      message.error("Entry not valid!");
    }
  };

  const handleModalCancel = (e) => {
    e.preventDefault();
    setIsModalVisible(false);
    newEntryForm.current = initialNewFormState;
  };

  const handleModalReset = (e) => {
    e.preventDefault();

    let date = document
      .getElementsByClassName("_addEntryDateValue")[0]
      .getElementsByTagName("input")[0];
    date.value = moment().format("DD/MM/YYYY");
    date.title = moment().format("DD/MM/YYYY");
    date.defaultValue = moment().format("DD/MM/YYYY");
    let time = document.getElementsByClassName("_addEntryTimeValue");
    [...time].forEach((item) => {
      let input = item.getElementsByTagName("input")[0];
      input.value = "00:00";
      input.title = "00:00";
      input.defaultValue = "00:00";
    });
    newEntryForm.current = initialNewFormState;
    message.warning("Form has been reset");
  };

  const handleEditModalAdd = (e) => {
    if (editEntryForm.current.sleepDuration) {
      e.preventDefault();
      // action newEntry
      dispatch(updateEntry(editEntryForm.current._id, editEntryForm.current));
      setIsEditModalVisible(false);
      message.success("Entry has been edited!");
      editEntryForm.current = initialEditFormState;
      currentEditEntryForm.current = initialEditFormState;
    } else {
      e.preventDefault();
      message.error("Entry not valid!");
    }
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    editEntryForm.current = initialEditFormState;
    currentEditEntryForm.current = initialEditFormState;
  };

  const handleEditModalReset = (e) => {
    e.preventDefault();
    let dateParts = currentEditEntryForm.current.date.split("/");
    let momentObj = moment(
      new Date(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`)
    ).format("DD/MM/YYYY");

    let date = document
      .getElementsByClassName("_editEntryDateValue")[0]
      .getElementsByTagName("input")[0];
    date.value = momentObj;
    date.title = momentObj;
    date.defaultValue = momentObj;
    let time = document.getElementsByClassName("_editEntryTimeValue");
    [...time].forEach((item, index) => {
      if (index === 0) {
        let input = item.getElementsByTagName("input")[0];
        input.value = currentEditEntryForm.current.sleepTime;
        input.title = currentEditEntryForm.current.sleepTime;
        input.defaultValue = initialEditFormState.sleepTime;
      }
      if (index === 1) {
        let input = item.getElementsByTagName("input")[0];
        input.value = currentEditEntryForm.current.wakeUpTime;
        input.title = currentEditEntryForm.current.wakeUpTime;
        input.defaultValue = initialEditFormState.wakeUpTime;
      }
    });
    editEntryForm.current = currentEditEntryForm.current;
    message.warning("Form has been reset");
  };

  const onChangeTimeLine = (e) => {
    console.log("radio4 checked", e.target.value);
    setTimeLine(e.target.value);
  };

  function confirmDelete(entry) {
    dispatch(deleteEntry(entry._id));
    message.success("Entry deleted!");
  }

  function cancelDelete(e) {}

  const handleEditBtn = (editEntry) => {
    currentEditEntryForm.current = { ...editEntry };
    let dateParts = currentEditEntryForm.current.date.split("/");
    let momentObj = moment(
      new Date(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`)
    ).format("DD/MM/YYYY");

    setTimeout(() => {
      let date = document
        .getElementsByClassName("_editEntryDateValue")[0]
        .getElementsByTagName("input")[0];
      date.value = momentObj;
      date.title = momentObj;
      date.defaultValue = momentObj;
      let time = document.getElementsByClassName("_editEntryTimeValue");
      [...time].forEach((item, index) => {
        if (index === 0) {
          let input = item.getElementsByTagName("input")[0];
          input.value = currentEditEntryForm.current.sleepTime;
          input.title = currentEditEntryForm.current.sleepTime;
          input.defaultValue = currentEditEntryForm.current.sleepTime;
        }
        if (index === 1) {
          let input = item.getElementsByTagName("input")[0];
          input.value = currentEditEntryForm.current.wakeUpTime;
          input.title = currentEditEntryForm.current.wakeUpTime;
          input.defaultValue = currentEditEntryForm.current.wakeUpTime;
        }
      });
    }, 0);

    editEntryForm.current = editEntry;
  };

  return (
    <div className="_home">
      <div className="_stat">
        <div className="_info">
          <div className="_addNewEntry">
            <button
              className="_addNewEntryBtn"
              type="primary"
              onClick={showModal}
            >
              <i className="fas fa-plus"></i> New entry
            </button>
            <div className="_addNewModal">
              <Modal
                title="Add new entry"
                visible={isModalVisible}
                destroyOnClose={true}
                footer={null}
              >
                <div className="_modalDate">
                  <span>Date: </span>
                  <DatePicker
                    className="_addEntryDateValue"
                    allowClear={false}
                    defaultValue={moment()}
                    format={["DD/MM/YYYY", "DD/MM/YY"]}
                    onChange={handleChangeNewDate}
                  />
                </div>
                <div>
                  <span>Sleep time: </span>
                  <TimePicker
                    className="_addEntryTimeValue"
                    allowClear={false}
                    format={"HH:mm"}
                    defaultValue={moment("00:00", "HH:mm")}
                    onChange={handleChangeNewSleepTime}
                  />
                  <span> to </span>
                  <TimePicker
                    className="_addEntryTimeValue"
                    allowClear={false}
                    format={"HH:mm"}
                    defaultValue={moment("00:00", "HH:mm")}
                    onChange={handleChangeNewWakeUpTime}
                  />
                </div>
                <div className="_modalBtn">
                  <button
                    className="_footerBtn _modelResetBtn"
                    key="3"
                    onClick={handleModalReset}
                  >
                    Reset
                  </button>
                  <button
                    className="_footerBtn _modelCancelBtn"
                    key="2"
                    onClick={handleModalCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="_footerBtn _modelAddBtn"
                    key="1"
                    onClick={handleModalAdd}
                  >
                    Add now
                  </button>
                </div>
              </Modal>

              <Modal
                title="Edit entry"
                visible={isEditModalVisible}
                destroyOnClose={true}
                footer={null}
              >
                <div className="_modalDate">
                  <span>Date: </span>
                  <DatePicker
                    className="_editEntryDateValue"
                    allowClear={false}
                    // defaultValue={moment()}
                    format={["DD/MM/YYYY", "DD/MM/YY"]}
                    onChange={handleChangeEditDate}
                  />
                </div>
                <div>
                  <span>Sleep time: </span>
                  <TimePicker
                    className="_editEntryTimeValue"
                    allowClear={false}
                    format={"HH:mm"}
                    // defaultValue={moment("00:00", "HH:mm")}
                    onChange={handleChangeEditSleepTime}
                  />
                  <span> to </span>
                  <TimePicker
                    className="_editEntryTimeValue"
                    allowClear={false}
                    format={"HH:mm"}
                    // defaultValue={moment("00:00", "HH:mm")}
                    onChange={handleChangeEditWakeUpTime}
                  />
                </div>
                <div className="_modalBtn">
                  <button
                    className="_footerBtn _modelResetBtn"
                    key="3"
                    onClick={handleEditModalReset}
                  >
                    Reset
                  </button>
                  <button
                    className="_footerBtn _modelCancelBtn"
                    key="2"
                    onClick={handleEditModalCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="_footerBtn _modelAddBtn"
                    key="1"
                    onClick={handleEditModalAdd}
                  >
                    Edit now
                  </button>
                </div>
              </Modal>
            </div>
          </div>
          <div className="_infoDetail">
            <h1>Good</h1>
            <p>
              Average sleep time: <span>7.8h/day</span>
            </p>
            <p>
              Average wake-up time: <span>6h35</span>
            </p>
            <p>
              Average bed time: <span>23h25</span>
            </p>
            <p>
              Days sleep &lt; 8h: <span>3</span>
            </p>
            <p>
              Days sleep &gt; 6h: <span>2</span>
            </p>
            <p className="_note">*Based on the last 7 days</p>
          </div>
        </div>
        <div className="_table">
          <div className="_filter">
            <div>
              <h2>Sleep stats</h2>
            </div>
            <div></div>
          </div>
          <Table
            dataSource={data}
            rowKey={(obj) => obj._id}
            pagination={{
              defaultPageSize: 7,
            }}
          >
            <Column title="Date" dataIndex="date" key="date" />
            <Column title="Time of sleep" dataIndex="sleepTime" key="date" />
            <Column title="Wake up time" dataIndex="wakeUpTime" key="date" />
            <Column
              title="Sleep duration"
              dataIndex="sleepDuration"
              key="date"
            />
            <Column
              title="Action"
              key="action"
              render={(text, record) => (
                <Space size="middle">
                  <i
                    className="far fa-edit _tableActionEdit"
                    onClick={() => {
                      setIsEditModalVisible(true);
                      //do edit here...
                      handleEditBtn(record);
                    }}
                  ></i>
                  <Popconfirm
                    title="Are you sure to delete this entry?"
                    //do delete here...
                    onConfirm={() => confirmDelete(record)}
                    onCancel={cancelDelete}
                    okText="Yes"
                    cancelText="No"
                  >
                    <a href=".">
                      <i className="far fa-trash-alt _tableActionDel"></i>
                    </a>
                  </Popconfirm>
                </Space>
              )}
            />
          </Table>
        </div>
      </div>
      <div className="_chart">
        <h2>Sleep duration</h2>
        <div className="_timeLine">
          <Radio.Group
            options={[
              { label: "Day", value: "day" },
              { label: "Week", value: "week" },
              { label: "Month", value: "month" },
            ]}
            onChange={onChangeTimeLine}
            value={timeLine}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
        <div className="_lineChart">
          <Line
            data={{
              labels: [
                "07/08",
                "08/08",
                "09/08",
                "10/08",
                "11/08",
                "12/08",
                "13/08",
              ],
              datasets: [
                {
                  data: [6, 6.5, 8, 7, 5, 9, 5],
                  label: "Sleep time",
                  borderColor: "#3e95cd",
                  fill: true,
                },
              ],
            }}
            options={{
              title: {
                display: false,
              },
              legend: {
                display: false,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
