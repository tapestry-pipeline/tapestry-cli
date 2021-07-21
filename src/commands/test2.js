const buildSyncScheduleObj = (syncChoice) => {
  let units = null;

  switch (syncChoice) {
    case 'Every hour':
      units = '1';
      break;
    case 'Every 6 hours':
      units = '6';
      break;
  }

  if (units) {
    return {
      "units": units,
      "timeUnit": "hours"
    }
  } else {
    return null;
  }
}

console.log(buildSyncScheduleObj('Every hour'));
console.log(buildSyncScheduleObj('Every 6 hours'));
console.log(buildSyncScheduleObj('manual'));