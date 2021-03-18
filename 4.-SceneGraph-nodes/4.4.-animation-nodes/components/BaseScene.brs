sub init()
    m.mainContainer = m.top.findNode("mainContainer")
    m.titleLabel = m.top.findNode("titleLabel")
    m.labelList = m.top.findNode("labelList")
    m.rowList = m.top.findNode("rowList")
    m.timeGrid = m.top.findNode("timeGrid")

    ' Animation nodes:
    m.translationAnimation = m.top.findNode("translationAnimation")
    m.translationInterpolator = m.top.findNode("translationInterpolator")

    ' m.opacityAnimation = m.top.findNode("opacityAnimation")

    setObservers()

    m.titleLabel.font.size = 45
    m.rowlist.content = CreateObject("roSGNode","RowListContent")

    setupTimeGrid()

    m.labelList.setFocus(true)

    ' m.opacityAnimation.control = "start"
end sub

sub setObservers()
    m.timeGrid.observeField("focusedChild", "translatePage")
end sub

function onKeyEvent(key as String, press as Boolean) as Boolean
    if press
        if key="up"
            m.labelList.setFocus(true)
        else if key="right" and m.labelList.focusedChild <> invalid
            m.rowList.setFocus(true)
        else if key="down"
            m.timeGrid.setFocus(true)
        else if key="left" and m.rowList.focusedChild <> invalid
            m.labelList.setFocus(true)
        end if
    end if
    return true
end function

sub translatePage(event as Object)
    translateDown = event.getData() <> invalid
    if translateDown
        m.translationInterpolator.keyValue = [m.mainContainer.translation, [0, -770]]
    else
        m.translationInterpolator.keyValue = [m.mainContainer.translation, [0, 0]]
    end if

    m.translationAnimation.control = "start"
end sub

sub setupTimegrid()
    currentTime = CreateObject("roDateTime")
    currentSeconds = currentTime.asSeconds()
    currentWithOffset = currentSeconds - (currentSeconds mod 1800) ' set to closest half hour

    m.timeGrid.contentStartTime = currentWithOffset - 3600
    m.timeGrid.content = buildTimeGridContent()
end sub

function buildTimeGridContent() as Object
    rootContent = createObject("roSGNode", "ContentNode")

    for i = 1 to m.timeGrid.numRows + 5
        channelNode = rootContent.createChild("ContentNode")
        channelNode.title = "Channel " + i.toStr()

        buildChannelContent(channelNode)
    end for

    return rootContent
end function

sub buildChannelContent(content as Object)
    date = CreateObject("roDateTime")
    nowSeconds = date.asSeconds()

    playStart = nowSeconds - (nowSeconds mod 1800) - 3600 * 2

    for i = 1 to 30
        program = content.createChild("ContentNode")

        program.title = "Program " + i.toStr()
        program.playStart = playStart
        program.playDuration = getPlayDuration()

        playStart = playStart + program.playDuration
    end for 
end sub

function getPlayDuration(min = 900 as integer, max = 3600 * 3, jump = 900 ) as Integer
    random = FIX(RND(0) * (max - min) + min)
    return random - (random mod jump)
end function