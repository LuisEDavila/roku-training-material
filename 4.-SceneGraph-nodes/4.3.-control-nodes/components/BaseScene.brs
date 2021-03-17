sub init()
    m.rowList = m.top.findNode("rowList")

    m.contentTask = CreateObject("roSGNode", "TestTask")
    m.timer = createTimer("getDelayedDataFromServer")

    setObservers()

    ' m.contentTask.control = "run" ' Get data from server
    m.timer.control = "start" ' get data from server with Timer delay

    m.rowList.content = CreateObject("roSGNode", "RowListContent")
    m.rowList.setFocus(true)
end sub

sub setObservers()
    m.contentTask.observeField("content", "onContentLoaded")
end sub

sub onContentLoaded(event as object)
    m.rowlist.content = event.getData()
end sub

sub getDelayedDataFromServer(event as Object)
    m.contentTask.control = "run"
end sub

function createTimer(callback as String, repeat = false as Boolean, duration = 5 as Integer) as Object
    timer = CreateObject("roSGNode", "Timer")
    timer.repeat = repeat
    timer.duration = duration
    timer.observeField("fire", callback)
    return timer
end function

function onKeyEvent(key as String, press as Boolean) as Boolean
    if press
        if key="down"
        else if key="up"
        end if
    end if
    return true
end function