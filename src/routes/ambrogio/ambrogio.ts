interface MiscStat {
  charge_count : number,
  first_charge_date : number,
  last_worked_minutes : number,
  total_worked_minutes : number
}

interface Errors {
  errors: {
    t_driver_count: number,
    failure_count: number,
    t_motor_count: number,
    bump_stop_count: number,
    current_count: number,
    watchdog_count: number,
    rpm_stop_count: number
  }
}

interface Stamp {
  counter:0,
  user_id: string,
  timestamp: number
}

interface GenericErrors {
  chams_count : number,
  wire_slip_count : number,
  rtc_restart_count : number,
  no_grass_count : number,
  no_signal_count : number,
  push_on_charge_count : number,
  rtc_stopped_count : number,
  amico_device_count : number,
  total_error_count : number,
  bump_count : number,
  smart_bump_count : number,
  smart_arrow_count : number,
  loop_count : number
}
interface Week {
  profile: number,
  schedule: {
    stamp: Stamp,
    cycles: {
      flags : number,
      starth : number,
      stoph : number,
      areas : number,
      startm : number,
      stopm : number
    }[]
  }
}
interface Profile {
  name: {
    profile: number,
    profile_name: {
      str: string,
      stamp: Stamp
    }
  },
  robot: {
    profile: 0,
    robot: {
      onwire: number,
      grass_sensibility: number,
      stamp: Stamp,
      blade_height: number,
      rain_sensor: number
    }
  },
  week:  Week[]
}
interface TempError {
  battery_overvoltage_count : number,
  failed_charge_count : number,
  blocked_on_wire_count : number,
  lift_count : number,
  battery_hot_count : number,
  high_grass_count : number,
  tilt_count : number,
  can_errors : {
    can1_count : number,
    can0_count : number
  }
}
interface Stats {
  signal : object,
  temp_error : TempError,
  middle_blade : Errors,
  left_wheel : Errors,
  right_wheel : Errors,
  right_blade : Errors,
  generic_errors : GenericErrors,
  left_blade : Errors
}

export interface Ambrogio {
  stats: {
    misc: MiscStat
  }[],
  machine: {
    tilt_zero: {xyz:number[]}[] ,
    average_discharge_curr: number,
    battery_type: number,
    motor_type: number[],
    battery_btaddr: number[],
    bldh_zero: number[]
  },
  version: number,
  cloud: {
    last_published : number,
    config_flags : number,
    program_version : number,
    program_id : number,
    flags : number,
    last_changed : number,
    available_functions : number
  },
  release: number,
  devices: {
    hwRevision : number,
    revision : number,
    serial : number,
    canId : number
  }[],
  settings: {
    areas:{
      index: number,
      area: {
        flags:0,
        onwire: 50,
        stamp: Stamp,
        distance: number,
        dimension: number
      }
    }[],
    profiles: Profile[],
    misc: {
      active_profile : number,
      spiral_threshold : number,
      station_gap : number,
      geofence_latitude : number,
      geofence_longitude : number,
      channel : number,
      ble_marker_adjust : number,
      wire_shift : number,
      stamp: Stamp,
      flags_1 : number,
      meters_after_marker : number,
      station_btaddr : number[],
      ble_backward_adjust : number,
      geofence_radius : number,
      language : number,
      pin : number,
      team_imei : string,
      flags : number,
      desired_speed : number
    }[]
  },
  factory: {
    validation_date : number,
    connect_date : number,
    activation_date : number,
    robot_serial : string,
    stamp : {
      counter : number,
      user_id : string,
      timestamp : number
    },
    connect_imei : string,
    service_date : number
  },
  program_id: number,
  upload_ts: number,
  syslogs: {
    stats:Stats[],
    events:{
      error: boolean,
      subEvents: {
        ntf_code : number,
        areaIndex : number,
        state : number,
        timestamp : number,
        error : boolean
      }[],
      areaIndex: number,
      ntf_code: number,
      stats: Stats,
      timestamp: number,
      motorsInfo: [],
      state: number
    }[]
  },
  robotCfg: {
    sensors_mask : number,
    nAreas : number,
    areaDimension : number,
    configFlags : number,
    desiredSpeedMin : number,
    desiredSpeedMax : number
  }
}

export function decodeState(state: number): string {
  switch (state){
    case 0: return '(0) Выключение'
    case 1: return '(1) Только перезарядка'
    case 2: return '(2)'
    case 3: return '(3) Зарядка'
    case 4: return '(4) Пауза во время работы'
    case 5: return '(5) Кошение'
    case 6: return '(6) '
    case 7: return '(7) Возврат на Зарядку'
    case 8: return '(8) Переход в Зону'
    case 9964: return '(9964) Работать До'
    default: return `(${state})${WARNINGS(state)}`
  }
}

export function decodeErrorState(state: number): string {
  switch (state){
    case 51: return 'Ошибка (51) Low battery'
    case 44: return 'Ошибка (44) Lift'
    case 4000: return 'Ошибка (4000) TRAPPPED no Grasss'
    case 5003: return 'Ошибка (5003) UNEXPECTED SHUTDOWN'
    case 5: return 'Ошибка (5) Blocked'
    default: return 'Ошибка (' + state + ')' + ROBOT_ERRORS(state)
  }
}

function Commands(state: number): string {
  switch(state) {
    case 9956: return 'BORDER_CUT'
    case 9953: return 'CHARGE_NOW'
    case 9965: return 'CHARGE_UNTIL'
    case 9959: return 'CLOSED_AREA'
    case 9958: return 'EXIT_NOW'
    case 9955: return 'GO_AWAY'
    case 9957: return 'GO_HOME_NOW'
    case 9960: return 'KEEP_OUT'
    case 9954: return 'PLAY'
    case 9964: return 'WORK_UNTIL'
    default: return States(state)
  }
}

function WARNINGS(state: number){
  switch(state) {
    case 9967: return "AIR_MARKER"
    case 9988: return "BATTERY_HOT"
    case 9966: return "BATTERY_OVER_VOLTAGE"
    case 9994: return "BLADE_ERROR"
    case 9974: return "BLETAG"
    case 9986: return "BLOCKED_ON_WIRE"
    case 9979: return "BUMP"
    case 9984: return "CANx_ERROR"
    case 9968: return "CHASM"
    case 9996: return "COMPASS_ERROR"
    case 9978: return "CURRENT_BUMP"
    case 9992: return "FAILED_CHARGE"
    case 9987: return "HALT"
    case 9985: return "HIGH_GRASS"
    case 9995: return "LIFT_ERROR"
    case 9982: return "LOOP"
    case 9981: return "NAVIGATOR_BACKWARD"
    case 9969: return "NO_GRASS"
    case 9971: return "PATH"
    case 9970: return "PATH_ABORT"
    case 9997: return "POSITION_ERROR"
    case 9983: return "PUSH_ON_CHARGE"
    case 9980: return "RAPID_RETURN"
    case 9989: return "ROTATION_SLIP"
    case 9976: return "SIGNAL"
    case 9972: return "STOP_PRESSED"
    case 9991: return "TILT_ERROR"
    case 9973: return "UNBLOCK"
    case 9993: return "WHEEL_ERROR"
    case 9975: return "WIRE_MARKER"
    case 9977: return "WIRE_SLIP"
    default: return Commands(state)
  }
}

function States(state: number): string {
  switch (state) {
    case 9963: return 'AREA_DONE'
    case 9962: return 'CYCLE_END'
    case 9961: return 'CYCLE_TIMEOUT'
    case 9998: return 'NO_RAIN'
    case 9999: return 'RAIN'
    case 0: return 'SHUTDOWN'
    default: return state.toString()
  }
}

function ROBOT_ERRORS(code: number): string {
  switch (code) {
    case 0: return  "bus_error"
    case 1: return  "sync_error"
    case 2: return  "blackout_sig02"
    case 3: return  "blackout_sig03"
    case 4: return  "blackout_sig04"
    case 5: return  "blocked"
    case 6: return  "bump_error"
    case 7: return  "bump_error_bump03"
    case 8: return  "grass_too_high"
    case 9: return  "out_of_border_block"
    case 10: return  "out_of_border_bord01"
    case 11: return  "out_of_border_bord02"
    case 12: return  "out_of_border_bord03"
    case 13: return  "out_of_border_bump01"
    case 14: return  "out_of_border_bump02"
    case 15: return  "out_of_border_out01"
    case 16: return  "out_of_border_out02"
    case 17: return  "out_of_border_start"
    case 18: return  "out_of_border_sync01"
    case 19: return  "out_of_border_sync02"
    case 20: return  "tilt"
    case 21: return  "blade_error"
    case 22: return  "blade_error_tmotor"
    case 23: return  "blade_error_tdrv"
    case 24: return  "blade_error_curr"
    case 25: return  "blade_error_rpm"
    case 26: return  "blade_error_wdog"
    case 27: return  "blade_error_fail"
    case 28: return  "wheel_error_left"
    case 29: return  "wheel_error_left_tmotor"
    case 30: return  "wheel_error_left_tdrv"
    case 31: return  "wheel_error_left_curr"
    case 32: return  "wheel_error_left_rpm"
    case 33: return  "wheel_error_left_wdog"
    case 34: return  "wheel_error_left_fail"
    case 35: return  "wheel_error_right"
    case 36: return  "wheel_error_right_tmotor"
    case 37: return  "wheel_error_right_tdrv"
    case 38: return  "wheel_error_right_curr"
    case 39: return  "wheel_error_right_rpm"
    case 40: return  "wheel_error_right_wdog"
    case 41: return  "wheel_error_right_fail"
    case 42: return  "out_of_border_out03"
    case 43: return  "rollover"
    case 44: return  "lift"
    case 45: return  "lift_lift2"
    case 46: return  "lift_lift3"
    case 47: return  "lift_lift4"
    case 48: return  "tilt_tilt3"
    case 49: return  "tilt_tilt4"
    case 50: return  "out_of_border_bump04"
    case 51: return  "low_battery"
    case 52: return  "power_off"
    case 53: return  "no_signal"
    case 54: return  "out_of_border_out04"
    case 55: return  "signal_returned"
    case 56: return  "autocheck_start"
    case 57: return  "autocheck_stop"
    case 58: return  "out_of_border_nosig"
    case 59: return  "no_signal_c1"
    case 60: return  "no_signal_c2"
    case 61: return  "no_signal_c2_1"
    case 62: return  "no_signal_c1_1"
    case 63: return  "out_of_border_bord04"
    case 64: return  "emergency_stop"
    case 65: return  "display_required"
    case 66: return  "receiver_required"
    case 67: return  "gsm_required"
    case 68: return  "driver_l_required"
    case 69: return  "driver_r_required"
    case 70: return  "driver_b_required"
    case 71: return  "magnet_required"
    case 72: return  "blocked_block1"
    case 73: return  "blocked_block3"
    case 79: return  "compass_required"
    case 80: return  "bump_error_front"
    case 81: return  "bump_error_back"
    case 82: return  "date_error"
    case 84: return  "program_error"
    case 85: return  "version_error"
    case 90: return  "safety_lift_sensor_damaged_or_dirty"
    case 91: return  "recharge_error"
    case 92: return  "autocheck_gyro"
    case 93: return  "autocheck_fail"
    case 94: return  "autocheck_rain"
    case 95: return  "autocheck_coils"
    case 96: return  "autocheck_motion"
    case 97: return  "autocheck_wheels_blocked"
    case 98: return  "autocheck_wheels_error"
    case 99: return  "autocheck_recharge"
    case 100: return  "autocheck_button_wrong"
    case 101: return  "autocheck_button_not_released"
    case 102: return  "autocheck_not_lifted"
    case 103: return  "display_error"
    case 104: return  "blade_error_blocked"
    case 105: return  "wheel_error_left_blocked"
    case 106: return  "wheel_error_right_blocked"
    case 107: return  "blade_error_left"
    case 108: return  "blade_error_left_tmotor"
    case 109: return  "blade_error_left_tdrv"
    case 110: return  "blade_error_left_curr"
    case 111: return  "blade_error_left_rpm"
    case 112: return  "blade_error_left_wdog"
    case 113: return  "blade_error_left_fail"
    case 114: return  "blade_error_left_blocked"
    case 115: return  "blade_error_right"
    case 116: return  "blade_error_right_tmotor"
    case 117: return  "blade_error_right_tdrv"
    case 118: return  "blade_error_right_curr"
    case 119: return  "blade_error_right_rpm"
    case 120: return  "blade_error_right_wdog"
    case 121: return  "blade_error_right_fail"
    case 122: return  "blade_error_right_blocked"
    case 123: return  "wheel_error_fl"
    case 124: return  "wheel_error_fl_tmotor"
    case 125: return  "wheel_error_fl_tdrv"
    case 126: return  "wheel_error_fl_curr"
    case 127: return  "wheel_error_fl_rpm"
    case 128: return  "wheel_error_fl_wdog"
    case 129: return  "wheel_error_fl_fail"
    case 130: return  "wheel_error_fl_blocked"
    case 131: return  "wheel_error_fr"
    case 132: return  "wheel_error_fr_tmotor"
    case 133: return  "wheel_error_fr_tdrv"
    case 134: return  "wheel_error_fr_curr"
    case 135: return  "wheel_error_fr_rpm"
    case 136: return  "wheel_error_fr_wdog"
    case 137: return  "wheel_error_fr_fail"
    case 138: return  "wheel_error_fr_blocked"
    case 139: return  "steer_error_fl"
    case 140: return  "steer_error_fl_tmotor"
    case 141: return  "steer_error_fl_tdrv"
    case 142: return  "steer_error_fl_curr"
    case 143: return  "steer_error_fl_rpm"
    case 144: return  "steer_error_fl_wdog"
    case 145: return  "steer_error_fl_fail"
    case 146: return  "steer_error_fl_blocked"
    case 147: return  "steer_error_fr"
    case 148: return  "steer_error_fr_tmotor"
    case 149: return  "steer_error_fr_tdrv"
    case 150: return  "steer_error_fr_curr"
    case 151: return  "steer_error_fr_rpm"
    case 152: return  "steer_error_fr_wdog"
    case 153: return  "steer_error_fr_fail"
    case 154: return  "steer_error_fr_blocked"
    case 155: return  "steer_error_bl"
    case 156: return  "steer_error_bl_tmotor"
    case 157: return  "steer_error_bl_tdrv"
    case 158: return  "steer_error_bl_curr"
    case 159: return  "steer_error_bl_rpm"
    case 160: return  "steer_error_bl_wdog"
    case 161: return  "steer_error_bl_fail"
    case 162: return  "steer_error_bl_blocked"
    case 163: return  "steer_error_br"
    case 164: return  "steer_error_br_tmotor"
    case 165: return  "steer_error_br_tdrv"
    case 166: return  "steer_error_br_curr"
    case 167: return  "steer_error_br_rpm"
    case 168: return  "steer_error_br_wdog"
    case 169: return  "steer_error_br_fail"
    case 170: return  "steer_error_br_blocked"
    case 171: return  "radar_error"
    case 172: return  "front_tilt_error"
    case 173: return  "hub_board_error"
    case 174: return  "bump_error_front_l_cent"
    case 175: return  "bump_error_front_cent_cent"
    case 176: return  "bump_error_front_r_cent"
    case 177: return  "bump_error_rear_l"
    case 178: return  "bump_error_rear_cent"
    case 179: return  "bump_error_rear_r"
    case 180: return  "bump_error_front_cent_l"
    case 181: return  "bump_error_front_cent_r"
    case 182: return  "chasm_error_front_l"
    case 183: return  "chasm_error_front_r"
    case 184: return  "bump_error_front_l_l"
    case 185: return  "bump_error_front_l_r"
    case 186: return  "bump_error_front_r_l"
    case 187: return  "bump_error_front_r_r"
    case 188: return  "bump_error_l_front"
    case 189: return  "bump_error_l_rear"
    case 190: return  "bump_error_r_front"
    case 191: return  "bump_error_r_rear"
    case 192: return  "grass_radar_error_l"
    case 193: return  "grass_radar_error_r"
    case 194: return  "grass_radar_error_cent"
    case 195: return  "bump_error_l"
    case 196: return  "bump_error_r"
    case 256: return  "board_error"
    case 257: return  "config_error"
    case 258: return  "test_b_required"
    case 259: return  "test_c_required"
    case 260: return  "trapped"
    case 1000: return  "sd_card_error"
    case 1001: return  "tilt_communication_error"
    case 1002: return  "rtc_error"
    case 1003: return  "can_0_error"
    case 1004: return  "can_1_error"
    case 1005: return  "blade_motor_communication_error"
    case 1006: return  "wheel_left_communication_error"
    case 1007: return  "wheel_right_communication_error"
    case 1008: return  "receiver_left_communication_error"
    case 1009: return  "connect_error"
    case 1010: return  "blade_height_error"
    case 1011: return  "bluetooth_error"
    case 1012: return  "geofence_error"
    case 1013: return  "gps_error"
    case 1014: return  "connect_error_1"
    case 1015: return  "over_current_error"
    case 1016: return  "over_voltage_error"
    case 1017: return  "eeprom_error"
    case 1018: return  "tilt_left_disconnect"
    case 1019: return  "tilt_right_disconnect"
    case 1020: return  "receiver_left_disconnect"
    case 1021: return  "receiver_right_disconnect"
    case 1022: return  "inductive_module_error"
    case 1023: return  "inductive_module_error_1"
    case 1024: return  "inductive_module_error_2"
    case 1025: return  "connect_module_error"
    case 1026: return  "middle_blade_driver_disconnected"
    case 1027: return  "blade_left_driver_disconnected"
    case 1028: return  "blade_right_driver_disconnected"
    case 1029: return  "display_communication_error"
    case 1030: return  "low_battery_while_charging"
    case 1031: return  "blade_height_left"
    case 1032: return  "blade_height_right"
    case 1033: return  "device_error_devicex_require"
    case 1042: return  "long_disconnection_middle_blade"
    case 1043: return  "long_disconnection_blade_left"
    case 1044: return  "long_disconnection_blade_right"
    case 1045: return  "battery_not_detected"
    case 1046: return  "zdefender_error"
    case 1047: return  "radar_data_save_error"
    case 1049: return  "docking_error"
    case 1050: return  "atomizer_module_error"
    case 1051: return  "radar_fl_not_calibrated"
    case 1052: return  "radar_fr_not_calibrated"
    case 1053: return  "radar_bl_not_calibrated"
    case 1054: return  "radar_br_not_calibrated"
    case 1055: return  "radar_fm_not_calibrated"
    case 1058: return  "front_tilt_board_error"
    case 1059: return  "ultrasound_hub_board_error"
    case 2000: return  "invalid_voucher"
    case 2001: return  "used_voucher"
    case 2002: return  "voucher_zone_error"
    case 2003: return  "server_connection_error"
    case 3001: return  "mismatch_wheel_motors"
    case 3002: return  "mismatch_back_coils"
    case 3003: return  "mismatch_left_coils"
    case 3004: return  "mismatch_right_coils"
    case 3005: return  "mismatch_front_coils"
    case 3006: return  "wrong_measurament_back_left_coil"
    case 3007: return  "wrong_measurament_back_right_coil"
    case 3008: return  "wrong_measurament_left_left_coil"
    case 3009: return  "wrong_measurament_left_right_coil"
    case 3010: return  "wrong_measurament_right_left_coil"
    case 3011: return  "wrong_measurament_right_right_coil"
    case 3012: return  "wrong_measurament_front_left_coil"
    case 3013: return  "wrong_measurament_front_right_coil"
    case 3014: return  "mismatch_bump"
    case 3015: return  "bump_sensor_blocked"
    case 3016: return  "lift_error"
    case 3017: return  "mismatch_lift_sensors"
    case 3018: return  "rain_error"
    case 3019: return  "stop_button_blocked"
    case 3020: return  "no_signal_back_receiver"
    case 3021: return  "no_signal_receiver_left"
    case 3022: return  "no_signal_receiver_right"
    case 3023: return  "no_signal_front_receiver"
    case 3033: return  "wrong_or_missing_action"
    case 4000: return  "trapped_no_grass"
    case 4001: return  "trapped_drop_off"
    case 4002: return  "trapped_bump"
    case 4003: return  "trapped_tilt"
    case 5000: return  "unexpected_shutdown_error"
    case 5001: return  "unexpected_shutdown_resume_from_failure"
    case 5002: return  "unexpected_shutdown_autocheck"
    case 5003: return  "unexpected_shutdown_charge"
    case 5004: return  "unexpected_shutdown_work"
    case 5005: return  "unexpected_shutdown_work_pause"
    case 5006: return  "unexpected_shutdown_done"
    case 5008: return  "unexpected_shutdown_error"
    case 10001: return  "invalid_connection"
    case 10002: return  "invalid_connection"
    case 10003: return  "wrong_server_authentication"
    case 10004: return  "server_disconnection"
    default: return code.toString()
  }
  
}