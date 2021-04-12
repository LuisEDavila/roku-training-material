function init()
    m.SEEK_STEP_IN_SEC = 10
    m.video = m.top.findNode("video")
    initializeVideo(m.video)

    m.video.observeField("state", "eventHandler")
    m.video.observeField("bufferingStatus", "eventHandler")
    m.video.observeField("position", "eventHandler")

    m.video.setFocus(true)
end function

function eventHandler(message as Object)
    print message.getField(), message.getData()
end function

function initializeVideo(video as Object)
    videoContent = createObject("roSGNode", "ContentNode")
    videoContent.url = "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8"
    videoContent.title = "Test Video"
    videoContent.streamformat = "hls"

    video.content = videoContent
    video.control = "play"
end function

function onKeyEvent(key as String, press as Boolean) as Boolean
    if press
        if key = "fastforward" OR key = "right"
            m.video.seek = m.video.position + m.SEEK_STEP_IN_SEC
        else if key = "rewind" OR key = "left"
            m.video.seek = m.video.position - m.SEEK_STEP_IN_SEC
        else if key = "play"
            if m.video.state = "paused"
                m.video.control = "resume"
            else
                m.video.control = "pause"
            end if
        end if
    end if
    return true
end function