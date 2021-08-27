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
  //data analysis
  const [averageSleepDuration, setAverageSleepDuration] = useState(0);
  const [averageSleepTime, setAverageSleepTime] = useState(0);
  const [averageWakeUpTime, setAverageWakeUpTime] = useState(0);
  const [averageSleep6h, setAverageSleep6h] = useState(0);
  const [averageSleep8h, setAverageSleep8h] = useState(0);
  //table
  const tableSleepDuration = useRef([]);
  const tableTimeLine = useRef([]);

  useEffect(() => {
    dispatch(getEntries());
  }, [dispatch]);

  useEffect(() => {
    const data = entries.slice(0, 7);
    setAverageSleepDuration(countAverageSleepDuration(data));
    setAverageSleepTime(countAverageSleepTime(data));
    setAverageWakeUpTime(countAverageWakeUpTime(data));
    setAverageSleep6h(countAverageSleep6h(data));
    setAverageSleep8h(countAverageSleep8h(data));
    //chart
    setDataChartDay(entries);
  }, [entries]);

  const countAverageSleepDuration = (data) => {
    const res = (
      data.reduce((acc, cur) => {
        return (acc += parseInt(cur.sleepDuration));
      }, 0) /
      data.length /
      60
    ).toFixed(1);
    if (isNaN(res)) return 0;
    return res;
  };
  const countAverageSleepTime = (data) => {
    const totalHour = data.reduce((acc, cur) => {
      return (acc += getHour(cur.sleepTime));
    }, 0);
    const totalMinute = data.reduce((acc, cur) => {
      return (acc += getMinute(cur.sleepTime));
    }, 0);
    const res = `${timeNumToString(
      Math.floor(totalHour / data.length)
    )}:${timeNumToString(Math.floor(totalMinute / data.length))}`;
    if (isNaN(Math.floor(totalHour / data.length))) return "00:00";
    return res;
  };
  const countAverageWakeUpTime = (data) => {
    const totalHour = data.reduce((acc, cur) => {
      return (acc += getHour(cur.wakeUpTime));
    }, 0);
    const totalMinute = data.reduce((acc, cur) => {
      return (acc += getMinute(cur.wakeUpTime));
    }, 0);
    const res = `${timeNumToString(
      Math.floor(totalHour / data.length)
    )}:${timeNumToString(Math.floor(totalMinute / data.length))}`;
    if (isNaN(Math.floor(totalMinute / data.length))) return "00:00";
    return res;
  };

  const timeNumToString = (num) => {
    if (num < 10) {
      return `0${num}`;
    } else {
      return "" + num;
    }
  };

  const countAverageSleep6h = (data) => {
    const res = data.reduce((acc, cur) => {
      if (parseInt(cur.sleepDuration) < 360) {
        return (acc += 1);
      } else {
        return acc;
      }
    }, 0);
    return res;
  };
  const countAverageSleep8h = (data) => {
    const res = data.reduce((acc, cur) => {
      if (parseInt(cur.sleepDuration) > 480) {
        return (acc += 1);
      } else {
        return acc;
      }
    }, 0);
    return res;
  };

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
    switch (e.target.value) {
      case "day":
        setDataChartDay(entries);
        break;
      case "week":
        setDataChartWeek(entries);
        break;
      case "month":
        setDataChartMonth(entries);
        break;
      default:
        break;
    }

    setTimeLine(e.target.value);
  };

  const groupDate = (entries) => {
    let group = [];
    let groupTemp = [];
    let entryTemp = null;

    entries.forEach((entry, index, array) => {
      if (index === 0) {
        entryTemp = entry;
        groupTemp.push(entry);
        if (array.length === 1) return groupTemp;
        return;
      }
      if (entry.date === entryTemp.date) {
        groupTemp.push(entry);
      }
      if (entry.date !== entryTemp.date || index === array.length - 1) {
        if (groupTemp.length > 1) {
          let totalSleepDuration = groupTemp.reduce((acc, cur) => {
            return (acc += parseInt(cur.sleepDuration));
          }, 0);
          group.push({
            ...entryTemp,
            sleepDuration: Math.floor(
              totalSleepDuration / groupTemp.length
            ).toString(),
          });
          entryTemp = entry;
          groupTemp = [];
          groupTemp.push(entry);
        } else {
          group.push(groupTemp[0]);
          if (index === array.length - 1) {
            group.push(entry);
            return group;
          }
          entryTemp = entry;
          groupTemp[0] = entry;
        }
      }
    });
    return group;
  };

  const groupMonth = (entries) => {
    let group = [];
    let groupTemp = [];
    let entryTemp = null;

    entries.forEach((entry, index, array) => {
      if (index === 0) {
        entryTemp = entry;
        groupTemp.push(entry);
        if (array.length === 1) return groupTemp;
        return;
      }
      if (entry.date.slice(3) === entryTemp.date.slice(3)) {
        groupTemp.push(entry);
      }
      if (
        entry.date.slice(3) !== entryTemp.date.slice(3) ||
        index === array.length - 1
      ) {
        if (groupTemp.length > 1) {
          let totalSleepDuration = groupTemp.reduce((acc, cur) => {
            return (acc += parseInt(cur.sleepDuration));
          }, 0);
          group.push({
            ...entryTemp,
            sleepDuration: Math.floor(
              totalSleepDuration / groupTemp.length
            ).toString(),
          });
          entryTemp = entry;
          groupTemp = [];
          groupTemp.push(entry);
        } else {
          group.push(groupTemp[0]);
          if (index === array.length - 1) {
            group.push(entry);
            return group;
          }
          entryTemp = entry;
          groupTemp[0] = entry;
        }
      }
    });
    return group;
  };

  const setDataChartDay = (entries) => {
    const data = groupDate(entries)
      .slice(0, 7)
      .sort(
        (a, b) =>
          a.date.split("/").reverse().join("") -
          b.date.split("/").reverse().join("")
      );
    const tSleepDuration = data.map((entry) =>
      (parseInt(entry.sleepDuration) / 60).toFixed(1)
    );
    const tTimeLine = data.map((entry) => entry.date);
    tableSleepDuration.current = tSleepDuration;
    tableTimeLine.current = tTimeLine;
  };

  const setDataChartWeek = (entries) => {
    const data = groupDate(entries)
      .slice(0, 49)
      .sort(
        (a, b) =>
          a.date.split("/").reverse().join("") -
          b.date.split("/").reverse().join("")
      );
    const res = [];
    let resTemp = [];
    data.forEach((entry, index, array) => {
      resTemp.push(entry);
      let date = "";
      let totalSleepDuration = 0;
      if (resTemp.length === 7 || index === array.length - 1) {
        resTemp.forEach((cur, index, arr) => {
          totalSleepDuration += +cur.sleepDuration;
          if (index === 0) {
            date += `${cur.date} - `;
          }
          if (index === arr.length - 1) {
            date += cur.date;
          }
        });

        const week = {
          date: date,
          sleepDuration: totalSleepDuration / resTemp.length,
        };
        res.push(week);
        resTemp = [];
      }
    });
    const tSleepDuration = res.map((e) => e.sleepDuration);
    const tTimeLine = res.map((e) => e.date);
    tableSleepDuration.current = tSleepDuration;
    tableTimeLine.current = tTimeLine;
  };

  const setDataChartMonth = (entries) => {
    data = groupMonth(entries)
      .slice(0, 7)
      .sort(
        (a, b) =>
          a.date.split("/").reverse().join("") -
          b.date.split("/").reverse().join("")
      );
    const tSleepDuration = data.map((entry) =>
      (parseInt(entry.sleepDuration) / 60).toFixed(1)
    );
    const tTimeLine = data.map((entry) => entry.date.slice(3));
    tableSleepDuration.current = tSleepDuration;
    tableTimeLine.current = tTimeLine;
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
              Average sleep duration: <span>{averageSleepDuration}h/day</span>
            </p>
            <p>
              Average wake up time: <span>{averageWakeUpTime}</span>
            </p>
            <p>
              Average sleep time: <span>{averageSleepTime}</span>
            </p>
            <p>
              Days sleep &gt; 8h: <span>{averageSleep8h}</span>
            </p>
            <p>
              Days sleep &lt; 6h: <span>{averageSleep6h}</span>
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
              render={(text, record) => {
                const sleepDurNum = parseInt(record.sleepDuration);
                return `${Math.floor(sleepDurNum / 60)}h${sleepDurNum % 60}m`;
              }}
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
              labels: tableTimeLine.current,
              datasets: [
                {
                  data: tableSleepDuration.current,
                  label: "Hours of sleep (h)",
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
