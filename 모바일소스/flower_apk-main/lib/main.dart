import 'dart:async';
import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'dart:io';
import 'package:permission_handler/permission_handler.dart';
import 'device_scan.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';



void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Permission.location.request();
  HttpOverrides.global = NoCheckCertificateHttpOverrides();

  runApp(MyApp());
}

class MyApp extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: WebViewExample(),
    );
  }
}

class WebViewExample extends StatefulWidget {
  @override
  _WebViewExampleState createState() => _WebViewExampleState();
}

class NoCheckCertificateHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return super.createHttpClient(context)
      ..badCertificateCallback = (X509Certificate cert, String host, int port) => true;
  }
}

class _WebViewExampleState extends State<WebViewExample> {
  late WebViewController _controller;
  String name = "";
  String mac = "";
  String MAC = "";
  List<ScanResult> scanResultList = [];
  bool _isScanning = false;
  bool _isConnecting = false;
  bool _isConnecting1 = false;
  bool _isConnecting2 = false;
  bool _isConnecting3 = false;
  FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();


  Future<void> _initializeNotifications() async {
    flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();

    const AndroidInitializationSettings initializationSettingsAndroid =
    AndroidInitializationSettings('@mipmap/ic_launcher');

    final InitializationSettings initializationSettings = InitializationSettings(
      android: initializationSettingsAndroid,
    );

    await flutterLocalNotificationsPlugin.initialize(
      initializationSettings,
      /*onSelectNotification: (payload) async {
        // 알림 클릭 시 로직 처리
      },*/
    );
  }

  Future<void> _showNotification(String type, String message) async {
    try {
      AndroidNotificationDetails androidPlatformChannelSpecifics =
      AndroidNotificationDetails(
        'your_channel_id',
        'your_channel_name',
        importance: Importance.max,
        priority: Priority.high,
        showWhen: false,
        fullScreenIntent: true,
        enableVibration: true,
        enableLights: true,
        visibility: NotificationVisibility.public,
      );
        // 여기에서 `PendingIntent`의 플래그를 설정합니다.

      NotificationDetails platformChannelSpecifics =
      NotificationDetails(android: androidPlatformChannelSpecifics);

      await flutterLocalNotificationsPlugin.show(
        0,
        type,
        message,
        platformChannelSpecifics,
        payload: '알림 페이로드',
      );
    } catch (e) {
      print('알림 표시 중 오류 발생: $e');
    }
  }


  BluetoothConnectionState deviceState = BluetoothConnectionState.disconnected;
  BluetoothDevice? mydevice = null;

  // 연결 상태 리스너 핸들 화면 종료시 리스너 해제를 위함

  List<BluetoothService> bluetoothService = [];

  @override
  initState() {
    super.initState();
    _initializeNotifications();
    // 블루투스 초기화
    initBle();
  }

  Future<void> sendMessage(String message) async {
    final WebViewController controller = await _controller;
    controller.runJavascript("window.postMessage('$message', '*');");
  }

  Future<bool> connect(BluetoothDevice device) async {
    Future<bool>? returnValue;
    /*
      타임아웃을 15초(15000ms)로 설정 및 autoconnect 해제
       참고로 autoconnect가 true되어있으면 연결이 지연되는 경우가 있음.
     */
    await device
        .connect(autoConnect: true)
        .timeout(Duration(milliseconds: 15000), onTimeout: () {
      //타임아웃 발생
      //returnValue를 false로 설정
      returnValue = Future.value(false);
      debugPrint('timeout failed');
    }).then((data) async {
      bluetoothService.clear();
      if (returnValue == null) {
        //returnValue가 null이면 timeout이 발생한 것이 아니므로 연결 성공
        debugPrint('connection successful');
        print('start discover service');
        List<BluetoothService> bleServices =
        await device.discoverServices();
        setState(() {
          bluetoothService = bleServices;
        });
        // 각 속성을 디버그에 출력

        for (BluetoothService service in bleServices) {
          for (BluetoothCharacteristic c in service.characteristics) {
            if ("ec0f" == c.uuid.toString()) {
              List<int> value = await c.read();

                _isConnecting3 = true;
                returnValue = Future.value(true);
                sendMessage("connect");
                break;

            }
          }
          print('============================================');
          print('Service UUID: ${service.uuid}');
          var characteristics = service.characteristics;
          for (BluetoothCharacteristic c in service.characteristics) {
            print('\tcharacteristic UUID: ${c.uuid.toString()}');
            print('\t\twrite: ${c.properties.write}');
            print('\t\tread: ${c.properties.read}');
            print('\t\tnotify: ${c.properties.notify}');
            print('\t\tisNotifying: ${c.isNotifying}');
            print(
                '\t\twriteWithoutResponse: ${c.properties
                    .writeWithoutResponse}');
            print('\t\tindicate: ${c.properties.indicate}');
          }
        }
        returnValue = Future.value(true);
      }
    });

    return returnValue ?? Future.value(false);
  }

  void disconnect(BluetoothDevice device) {
    try {
      device.disconnect();
    } catch (e) {}
  }

  void initBle() {
    // BLE 스캔 상태 얻기 위한 리스너
    FlutterBluePlus.isScanning.listen((isScanning) {
      _isScanning = isScanning;
      setState(() {});
    });
  }

  /*
  스캔 시작/정지 함수
  */


  Future<bool> scan(String maca) async {
    Future<bool>? returnValue;
    if (mydevice != null) {
      returnValue =  Future.value(true);
      return returnValue;
    }
    if (!_isScanning) {
      // 스캔 중이 아니라면
      // 기존에 스캔된 리스트 삭제
      scanResultList.clear();
      FlutterBluePlus.startScan();
      // 스캔 결과 리스너 timeout: const Duration(seconds: 3)
      FlutterBluePlus.scanResults.listen((results) async {
        // List<ScanResult> 형태의 results 값을 scanResultList에 복사
        scanResultList = results;
        // UI 갱신
        setState(() {});
        for (ScanResult r in scanResultList) {
          if (r.device.id.id.toString() == maca) {
            mydevice = r.device;
            setState(() {});
            _isConnecting2 = await connect(mydevice!);
            await FlutterBluePlus.stopScan();
            returnValue = Future.value(_isConnecting2);
            break;
          }
        }
      });
      // 스캔 시작, 제한 시간 4초
      /*
      FlutterBluePlus.startScan(timeout: const Duration(seconds: 3));
      // 스캔 결과 리스너
      FlutterBluePlus.scanResults.listen((results) async {
        // List<ScanResult> 형태의 results 값을 scanResultList에 복사
        scanResultList = results;
        // UI 갱신
        setState(() {});
          for (ScanResult r in scanResultList) {
            if (r.device.id.id.toString() == maca) {
              mydevice = r.device;
              setState(() {});
              await connect(mydevice!);
              //break;
            }
          }
      });*/
    } else {
      // 스캔 중이라면 스캔 정지
      //var stopScan = FlutterBluePlus.stopScan();
    }
    return returnValue ?? Future.value(false);
  }

  void permission() async {
    WidgetsFlutterBinding.ensureInitialized();
    await Permission.location.request();
    //await scan();
  }



  Future<bool> ConnetMyDevice(String maca) async {
    Future<bool>? returnValue;
    if (mydevice == null) {
      _isConnecting1 = await scan(maca);
      returnValue = Future.value(_isConnecting1);
    }
    /*
    if(bluetoothService==[]){
      bluetoothService = await mydevice!.discoverServices();
    }*/
    return returnValue ?? Future.value(false);
  }
  Future<bool> ConnetCheck(String maca) async {
    Future<bool>? returnValue;
    if (mydevice == null) {
      await scan(maca);
    }
    bluetoothService =
    await mydevice!.discoverServices();
    if(bluetoothService==[]){
      bluetoothService = await mydevice!.discoverServices();
    }

    return returnValue ?? Future.value(false);
  }


  void WritePlant(String plant) async {
    if (mydevice == null) {
      await ConnetMyDevice(MAC);
      if(bluetoothService==[]){bluetoothService =
      await mydevice!.discoverServices();}

    }
    bluetoothService =
    await mydevice!.discoverServices();
      if (bluetoothService == []) {
        bluetoothService =
        await mydevice!.discoverServices();
      }
      for (BluetoothService service in bluetoothService) {
        for (BluetoothCharacteristic c in service.characteristics) {
          if ("ec1f" == c.uuid.toString()) {
          String request = plant;
          List<int> data = utf8.encode(request);
          await c.write(data);
          }
        }
      }
  }

  void WriteModule(String setting) async {
    if (mydevice == null) {
      await ConnetMyDevice(MAC);
      if(bluetoothService==[]){bluetoothService =
      await mydevice!.discoverServices();}

    }
    bluetoothService =
    await mydevice!.discoverServices();
    if (bluetoothService == []) {
      bluetoothService =
      await mydevice!.discoverServices();
    }
    for (BluetoothService service in bluetoothService) {
      for (BluetoothCharacteristic c in service.characteristics) {
        if ("ec2f" == c.uuid.toString()) {
          String request = setting;
          List<int> data = utf8.encode(request);
          await c.write(data);
        }
      }
    }
  }
  void WriteAuto(String setting) async {
    if (mydevice == null) {
      await ConnetMyDevice(MAC);
      if(bluetoothService==[]){bluetoothService =
      await mydevice!.discoverServices();}

    }
    bluetoothService =
    await mydevice!.discoverServices();
    if (bluetoothService == []) {
      bluetoothService =
      await mydevice!.discoverServices();
    }
    for (BluetoothService service in bluetoothService) {
      for (BluetoothCharacteristic c in service.characteristics) {
        if ("ec3f" == c.uuid.toString()) {
          String request = setting;
          List<int> data = utf8.encode(request);
          await c.write(data);
        }
      }
    }
  }

  void WriteDevice(String device) async {
    if (mydevice == null) {
      await ConnetMyDevice(MAC);
      if(bluetoothService==[]){bluetoothService =
      await mydevice!.discoverServices();}

    }
    bluetoothService =
    await mydevice!.discoverServices();
    if (bluetoothService == []) {
      bluetoothService =
      await mydevice!.discoverServices();
    }
    for (BluetoothService service in bluetoothService) {
      for (BluetoothCharacteristic c in service.characteristics) {
        if ("ec0f" == c.uuid.toString()) {
          String request = device;
          List<int> data = utf8.encode(request);
          await c.write(data);
        }
      }
    }
  }

  void InitDevice() async {
    if (mydevice == null) {
      await ConnetMyDevice(MAC);
      if(bluetoothService==[]){bluetoothService =
      await mydevice!.discoverServices();}

    }
    bluetoothService =
    await mydevice!.discoverServices();
    if (bluetoothService == []) {
      bluetoothService =
      await mydevice!.discoverServices();
    }
    for (BluetoothService service in bluetoothService) {
      for (BluetoothCharacteristic c in service.characteristics) {
        if ("ec2f" == c.uuid.toString()) {
          List<int> value = await c.read();
          disconnect(mydevice!);
        }
      }
    }
  }

  Future<bool> AiRequest() async {
    Future<bool>? returnValue;
    if (mydevice == null) {
      await ConnetMyDevice(MAC);
    }
    bluetoothService =
    await mydevice!.discoverServices();
    if(bluetoothService==[]){bluetoothService =
    await mydevice!.discoverServices();}
    for (BluetoothService service in bluetoothService) {
      for (BluetoothCharacteristic c in service.characteristics) {
        if ("ec1f" == c.uuid.toString()) {
          List<int> value = await c.read();
          sendMessage("AIRequest");
          if(String.fromCharCodes(value)=="200"){
            /*
            returnValue = Future.value(true);
          }else{
            returnValue = Future.value(false);
             */
          }
        }
      }
    }
    returnValue = Future.value(true);
    return returnValue ?? Future.value(false);
  }
/*
for (BluetoothService service in bluetoothService) {
        for (BluetoothCharacteristic c in service.characteristics) {
          if ("ec0f" == c.uuid.toString()) {
            List<int> value = await c.read();
            break;
          }
        }
      }
 */


  // 메시지 보내기 함수

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // 뒤로가기 버튼 추가
      /*
      appBar: AppBar(
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () async {
            if (await _controller.canGoBack()) {
              await _controller.goBack();
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('이전 페이지가 없습니다.')),
              );
            }
          },
        ),
      ),
        */
        body: WillPopScope( // WillPopScope 추가
        onWillPop: () async {
      if (await _controller.canGoBack()) {
    _controller.goBack();
    return Future.value(false); // 기본 뒤로 가기 동작 방지
    }
    return Future.value(true); // 웹뷰가 뒤로 갈 수 없다면, 기본 동작 허용
    },
    child: Column(
        children: [
          Expanded(
            child: WebView(
              initialUrl: 'http://ceprj.gachon.ac.kr:60007/', // 여기에 원하는 URL을 입력하세요.
              javascriptMode: JavascriptMode.unrestricted,
              onWebViewCreated: (WebViewController webViewController) {
                _controller = webViewController;
                webViewController.loadUrl('http://ceprj.gachon.ac.kr:60007/');
              },
              javascriptChannels: <JavascriptChannel>{
                JavascriptChannel(
                    name: 'toApp',
                    onMessageReceived: (JavascriptMessage message) async {
                      final returnValue = await Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => DeviceScan()),
                      );
                      _controller.runJavascript(
                          'window.postMessage("$returnValue", "*");');
                      setState(() {
                      });
                    }),

                JavascriptChannel(
                    name: 'sendFlowerName',
                    onMessageReceived: (JavascriptMessage message)  async {
                    print("판별결과: ${message.message}");
                    WritePlant(message.message);
                    }),
                JavascriptChannel(
                    name: 'Pump',
                    onMessageReceived: (JavascriptMessage message)  async {
                      print("급수동작: ${message.message}");
                      await _showNotification("알림 센터", message.message);
                    }),
                JavascriptChannel(
                    name: 'water',
                    onMessageReceived: (JavascriptMessage message)  async {
                      print("물량부족: ${message.message}");
                      await _showNotification("알림 센터",message.message);
                    }),
                JavascriptChannel(
                    name: 'BleUse',
                    onMessageReceived: (JavascriptMessage message)  async {
                      print("BLE ID: ${message.message}");
                      MAC = message.message;
                      _isConnecting = await ConnetMyDevice(message.message);

                      if(mydevice!=null){
                        _controller.runJavascript(
                            'window.postMessage("connect", "*");');
                      }
                      /*
                      if(_isConnecting == true) {
                        print("연결");
                      _controller.runJavascript(
                      'window.postMessage("res", "*");');
                      }
                      if(_isConnecting3 == true){
                        _controller.runJavascript(
                            'window.postMessage("res", "*");');
                      }*/

                    }),
                JavascriptChannel(
                    name: 'sendAI',
                    onMessageReceived: (JavascriptMessage message) async {
                    print("AI요청: ${message.message}");
                    await AiRequest();

                  }),
                JavascriptChannel(
                    name: 'sendDeviceName',
                    onMessageReceived: (JavascriptMessage message) async {
                      print("Device이름 변경: ${message.message}");
                      WriteDevice(message.message);
                    }),
                JavascriptChannel(
                    name: 'sendModuleSetting',
                    onMessageReceived: (JavascriptMessage message) async {
                      print("모듈세팅 변경: ${message.message}");
                      WriteModule(message.message);
                    }),
                JavascriptChannel(
                    name: 'sendAutoSetting',
                    onMessageReceived: (JavascriptMessage message) async {
                      print("자동설정 변경: ${message.message}");
                      WriteAuto(message.message);
                    }),
                JavascriptChannel(
                    name: 'sendInitSetting',
                    onMessageReceived: (JavascriptMessage message) async {
                      print("자동설정 변경: ${message.message}");
                      InitDevice();
                    }),

                },

              navigationDelegate: (NavigationRequest request) {
                if (request.url.startsWith('https://ceprj.gachon.ac.kr')) {
                  return NavigationDecision.navigate; // 허용
                }
                return NavigationDecision.prevent; // 방지
              },
            ),
          ),
          // 버튼을 누르면 리액트로 메세지 전송
          /*ElevatedButton(

            onPressed: ConnetMyDevice,
            child: Text('Send Message to React'),
          ),*/
        ],
      ),),
    );
  }
}


