# Readnow-1.0
Probably the easyest way to go online with your IoT

On Readnow you would be able to create your individual page, where you can send and display data easily. This can be done with HTTP requests, both with PUT(recomended) and POST.

Online demo: http://readnow.vulkanclub.tech/

Webapp is not optimise for mobile phones with small screen (comming soon).

How to use:

![](screenshots/Screenshot_mainpage_Readnow.png)

Enter Title of your project. Add one or more parameters (like Temperature, humidity etc. you want to monitor) and extensions like °C, % etc. Click submit button.


![](screenshots/Screenshot_nodeview_Readnow.png)

You now created your project node. Your node was assigned an id wich you see on top right corner. Later you can use that id to log in into your node page, so copy and save it now please.
That’s it, no need to register.


![](screenshots/Screenshot_node_with_value_Readnow.png)

Now when everything is seted up, you can test and send values to your node using your id.
Proper way to update a value would be to make a PUT (or POST) requiest on http://readnow.vulkanclub.tech/postValue and send JSON like so:

```
{
    "title": "Tunnel project",
    "pos1param": {
        "name": "Temperature",
        "ext": "C",
        "value": 33
     },
     "pos2param": {
        "name": "Humidity",
        "ext": "%",
        "value": 44
     },
     "pos3param": {
        "name": "Fan speed",
        "ext": "rp",
        "value": 277
     },
     "id": "5c73c132610cc44e5e2cc062"
}
```
With every request you can change title, names, extensions or even add or remove the whole entry (e.g. pos2param).
You Can't change the password. It throws an error if you try.

Project page checks in every 5 seconds if there are new values.
If values were not update in at least every 10 seconds, status will be off (device is offline). In future this and other options will be able for user to set.
