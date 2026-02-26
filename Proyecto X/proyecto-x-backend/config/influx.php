<?php

return [
    'url' => env('INFLUX_URL'),
    'token' => env('INFLUX_TOKEN'),
    'org' => env('INFLUX_ORG'),
    'bucket' => env('INFLUX_BUCKET'),
    'timeout' => (int) env('INFLUX_TIMEOUT', 10),
];