function init()
    m.top.setFocus(true)

    card = CreateObject("roSGNode", "Card")
    card.setFields({
        id: "user3"
        firstName: "John"
        lastName: "Doe"
        imageUrl: "https://picsum.photos/id/240/200/200"
        translation: [420, 0]
    })

    m.top.appendChild(card)
end function

function onKeyEvent(key as String, press as Boolean) as Boolean
    print key, press
    return true
end function