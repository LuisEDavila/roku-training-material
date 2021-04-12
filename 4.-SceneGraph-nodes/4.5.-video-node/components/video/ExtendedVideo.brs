sub init()
    m.ExtVideo = m.top
    m.top.observeField("state", "handleStateChange")
    m.top.observeField("bufferingStatus", "handleBufferingStatus")

    m.trickPosition = 0
    m.trickOffset = 0
    m.trickInterval = 5

    m.trickPlayTimer = createObject("roSGNode", "Timer")
    m.trickPlayTimer.duration = 1
    m.trickPlayTimer.repeat = true
    m.trickPlayTimer.observeField("fire", "handleTrickPlayTimer")

    initProgressBar()
    initLoadingBar()
end sub

sub handleStateChange(msg as Object)
    if type(msg) = "roSGNodeEvent" AND msg.getField() = "state"
        state = msg.getData()
        if state = "finished"
            m.top.visible = false
            m.ButtonGroup = m.top.getScene().findNode("ButtonGroup")
            m.ButtonGroup.setFocus(true)
        end if
        m.videoDuration = m.top.duration
    end if
end sub

function formatNumberString(number as Integer) as String
    numberText = number.toStr()
    if number <= 0
        numberText = "00"
    else if number < 10
        numberText = "0" + numberText
    else if number > 99
        numberText = "99"
    end if
    return numberText
end function

function setTimeText(timeInSeconds as Integer) as String
    hoursText = formatNumberString(FIX(timeInSeconds / 3600))
    minutesText = formatNumberString(FIX(timeInSeconds / 60))
    secondsText = formatNumberString(FIX(timeInSeconds MOD 60))

    timeText = minutesText + ":" + secondsText
    if hoursText <> "00"
        timeText = hoursText + ":" + timeText
    end if

    return timeText
end function

sub initProgressBar()
    m.progress = m.top.findNode("progress")
    m.progress.visible = false

    m.progressWidth = m.top.findNode("outlineRect").width
    m.progressRect = m.top.findNode("progressRect")
    m.leftProgressLabel = m.top.findNode("leftProgressLabel")
    m.rightProgressLabel = m.top.findNode("rightProgressLabel")
    m.progressMode = m.top.findNode("progressMode")
end sub

sub showProgressBar(position as Float)
    m.progress.visible = true
    m.progressRect.width = position * m.progressWidth / m.videoDuration
    leftPositionSeconds = position * 100 / 100
    rightPositionSeconds = m.videoDuration - leftPositionSeconds
    m.leftProgressLabel.text = setTimeText(leftPositionSeconds)
    m.rightProgressLabel.text = setTimeText(rightPositionSeconds)
    setProgressMode()
end sub

sub hideProgressBar()
    m.progress.visible = false
end sub

sub setProgressMode()
    if m.trickPlaySpeed = 0
        m.progressMode.uri = "pkg:/images/TrickPlay_ButtonMode_PAUSE_HD.png"
    else if m.trickPlaySpeed > 0
        if m.trickplaySpeed = 1
            m.progressMode.uri = "pkg:/images/TrickPlay_ButtonMode_FWDx1_HD.png"
        else if m.trickplaySpeed = 2
            m.progressMode.uri = "pkg:/images/TrickPlay_ButtonMode_FWDx2_HD.png"
        else
            m.progressMode.uri = "pkg:/images/TrickPlay_ButtonMode_FWDx3_HD.png"
        end if
    else if m.trickPlaySpeed < 0
        if m.trickplaySpeed = -1
            m.progressMode.uri = "pkg:/images/TrickPlay_ButtonMode_REWx1_HD.png"
        else if m.trickplaySpeed = -2
            m.progressMode.uri = "pkg:/images/TrickPlay_ButtonMode_REWx2_HD.png"
        else
            m.progressMode.uri = "pkg:/images/TrickPlay_ButtonMode_REWx3_HD.png"
        end if
    end if
end sub

sub setProgressModePlay()
    m.progressMode.uri = "pkg:/images/TrickPlay_ButtonMode_PLAY_HD.png"
end sub

sub resetSeekLogic()
    m.trickPlaySpeed = 0
    m.trickOffset = 0
    m.trickPlayTimer.duration = 1
end sub

function isSeeking() as Boolean
    return m.trickPlaySpeed <> 0 OR m.trickOffset <> 0
end function

sub startSeeking()
    m.trickPlayTimer.control = "stop"

    if m.trickPlaySpeed <> 0
        m.trickPlayTimer.duration = 1 / abs(m.trickPlaySpeed)
        m.trickPlayTimer.control = "start"
    else
        m.TrickPlayTimer.duration = 1
    end if
end sub

sub pauseSeeking(key as String, position as Float)
    m.trickPlayTimer.control = "stop"
    m.trickPlaySpeed = 0

    if key = "right"
        if position + m.trickOffset + m.trickInterval <= m.videoDuration
            m.trickOffset += m.trickInterval
        else
            m.trickOffset = m.videoDuration - m.ExtVideo.position
        end if
    else if key = "left"
        if position + m.trickOffset - m.trickInterval >= 0
            m.trickOffset -= m.trickInterval
        else
            m.trickOffset = m.ExtVideo.position * -1
        end if
    end if

    showProgressBar(position + m.trickOffset)
end sub

sub endSeeking()
    m.trickPlayTimer.control = "stop"

    m.ExtVideo.seek = m.ExtVideo.position + m.trickOffset

    resetSeekLogic()
    setProgressModePlay()
end sub

sub handleTrickPlayTimer()
    if m.trickPlaySpeed > 0
        if m.ExtVideo.position + m.trickOffset + m.trickInterval <= m.videoDuration
            m.trickOffset += m.trickInterval
        else
            m.trickOffset = m.videoDuration - m.ExtVideo.position
        end if
    else if m.trickPlaySpeed < 0
        if m.ExtVideo.position + m.trickOffset - m.trickInterval >= 0
            m.trickOffset -= m.trickInterval
        else
            m.trickOffset = m.ExtVideo.position * -1
        end if
    end if

    showProgressBar(m.ExtVideo.position + m.trickOffset)
end sub

sub initLoadingBar()
    m.loadingPercentage = 0
    m.loading = m.top.findNode("loading")
    m.loading.visible = false
    m.loadingWidth = m.top.findNode("loadOutlineRect").width
    m.loadingProgressRect = m.top.findNode("loadProgressRect")
end sub

sub showLoadingBar()
    m.loading.visible = true
    m.loadingProgressRect.width = m.loadingPercentage * m.loadingWidth / 100
end sub

sub hideLoadingBar()
    m.loading.visible = false
    m.loadingPercentage = 0
end sub

sub handleBufferingStatus(msg)
    bufferingStatus = msg.getData()
    if bufferingStatus <> invalid
        m.loadingPercentage = bufferingStatus.percentage

        showLoadingBar()
        if m.loadingPercentage = 100
            hideLoadingBar()
            hideProgressBar()
        end if
    end if
end sub

function onKeyEvent(key as String, press as Boolean) as Boolean
    handled = false
    if press
        if key = "fastforward" OR key = "rewind"
            m.ExtVideo.control = "pause"
            position = m.ExtVideo.position + m.trickOffset

            if key = "fastforward"
                m.trickPlaySpeed++
                if m.trickPlaySpeed > 3
                    m.trickPlaySpeed = 1
                end if
            else if key = "rewind"
                m.trickPlaySpeed--
                if m.trickPlaySpeed < -3
                    m.trickPlaySpeed = -1
                end if
            end if

            if position <= m.videoDuration AND position >= 0
                showProgressBar(position)
                startSeeking()
            end if
            handled = true
        else if key = "left" OR key = "right"
            m.ExtVideo.control = "pause"
            pauseSeeking(key, m.ExtVideo.position)
            handled = true
        else if key = "play" OR key = "OK"
            if m.ExtVideo.state = "playing"
                showProgressBar(m.ExtVideo.position)
                m.ExtVideo.control = "pause"
            else
                if isSeeking()
                    showLoadingBar()
                    endSeeking()
                else
                    m.ExtVideo.control = "resume"
                    hideProgressBar()
                end if
            end if
            handled = true
        else if key = "back"
            m.ExtVideo.control = "stop"
            endSeeking()
            hideProgressBar()
        end if
    end if

    return handled
end function