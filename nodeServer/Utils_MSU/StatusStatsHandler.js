import Course from './../Models/courseModel';
import Stats from './../Models/statsModal';

const updateStats = async (oldValue, newValue, courseId, byId = true) => {
  const DATE = new Date();
  const YY = DATE.getFullYear();
  const mm = String(DATE).split(' ')[1]; // to get the second element of the generated array

  const thisMonth = `${mm}/${YY}`;
  let stats;
  if (byId === false) {
    course = await Course.findOne({ courseCode: courseId });
  } else {
    course = await Course.findById(courseId);
  }

  const now = Date.now();

  switch (oldValue.toUpperCase()) {
    case "STUDENT":
      if (oldValue !== newValue && newValue !== 'none') {
        if (newValue === "deffered") {
          stats = await Stats.findOne({ month: thisMonth });

          if (stats) {
            stats.students -= 1;
            stats.deffered += 1;
            stats.updated = now;
            await stats.save();
          } else {
            let statsRecord = await Stats.find();
            const newStats = {
              month: thisMonth,
              students: statsRecord[statsRecord.length - 1].students - 1,
              deffered: statsRecord[statsRecord.length - 1].deffered + 1,
              alumni: statsRecord[statsRecord.length - 1].deffered - 1
            };
            await Stats.create(newStats);
          }

          course.students -= 1;
          course.deffered += 1;
          course.updated = now;
          await course.save();
        }
      }
      return newValue;

    case "DEFFERED":
      if (oldValue !== newValue && newValue !== 'none') {
        if (newValue === "student") {
          stats = await Stats.findOne({ month: thisMonth });

          if (stats) {
            stats.students += 1;
            stats.deffered -= 1;
            stats.updated = now;
            await stats.save();
          } else {
            let statsRecord = await Stats.find();
            const newStats = {
              month: thisMonth,
              students: statsRecord[statsRecord.length - 1].students,
              deffered: statsRecord[statsRecord.length - 1].deffered,
              alumni: statsRecord[statsRecord.length - 1].deffered
            };
            await Stats.create(newStats);
          }

          course.students += 1;
          course.deffered -= 1;
          course.updated = now;
          await course.save();
        }
      }
      return newValue;

    case "ALUMNI":
      if (oldValue !== newValue && newValue !== 'none') {
        if (newValue === "student") {
          stats = await Stats.findOne({ month: thisMonth });

          if (stats) {
            stats.alumni -= 1;
            stats.students += 1;
            stats.updated = now;
            await stats.save();
          } else {
            let statsRecord = await Stats.find();
            const newStats = {
              month: thisMonth,
              students: statsRecord[statsRecord.length - 1].students + 1,
              alumni: statsRecord[statsRecord.length - 1].deffered - 1,
              deffered: statsRecord[statsRecord.length - 1].deffered
            };
            await Stats.create(newStats);
          }

          course.alumni += 1;
          course.deffered += 1;
          course.updated = now;
          await course.save();
        }
      }
      return newValue;

    case "NEWCOURSE":
      if (oldValue !== newValue && newValue !== 'none') {
        if (newValue === "student") {
          stats = await Stats.findOne({ month: thisMonth });

          if (stats) {
            stats.students += 1;
            stats.updated = now;
            await stats.save();
          } else {
            let statsRecord = await Stats.find();
            const newStats = {
              month: thisMonth,
              students: statsRecord[statsRecord.length - 1].students + 1,
              alumni: statsRecord[statsRecord.length - 1].deffered,
              deffered: statsRecord[statsRecord.length - 1].deffered
            };
            await Stats.create(newStats);
          }

          course.students += 1;
          course.updated = now;
          await course.save();
        }
      }
      return newValue;

    case "ENQUIRY":
      stats = await Stats.findOne({ month: thisMonth });
      if (stats) {
        stats.enquiryCount += 1;
        stats.updated = now;
        await stats.save();
      } else {
        let statsRecord = await Stats.find();
        const newStats = {
          month: thisMonth,
          students: statsRecord[statsRecord.length - 1].students,
          alumni: statsRecord[statsRecord.length - 1].deffered,
          deffered: statsRecord[statsRecord.length - 1].deffered,
          enquiryCount: 1
        };
        await Stats.create(newStats);
      }
      return newValue;

    case "APPROVETRUE":
      stats = await Stats.findOne({ month: thisMonth });
      if (stats) {
        stats.students += 1;
        stats.updated = now;
        await stats.save();
      } else {
        let statsRecord = await Stats.find();
        const newStats = {
          month: thisMonth,
          students: statsRecord[statsRecord.length - 1].students + 1,
          alumni: statsRecord[statsRecord.length - 1].deffered,
          deffered: statsRecord[statsRecord.length - 1].deffered
        };
        await Stats.create(newStats);
      }
      return newValue;

    case "APPROVEFALSE":
      stats = await Stats.findOne({ month: thisMonth });
      if (stats) {
        stats.students -= 1;
        stats.updated = now;
        await stats.save();
      } else {
        let statsRecord = await Stats.find();
        let lastStatsRecord = { ...statsRecord[statsRecord.length - 1] };
        const newStats = {
          month: thisMonth,
          students: lastStatsRecord.students - 1,
          alumni: lastStatsRecord.deffered,
          deffered: lastStatsRecord.deffered
        };
        await Stats.create(newStats);
      }
      return newValue;

    default:
      return oldValue;
  }
};

export default updateStats;
