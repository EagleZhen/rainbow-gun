import mido

# List available MIDI input ports
print("Available MIDI ports:")
for port in mido.get_input_names():
    print(f"  - {port}")

# Open the first available port
port_name = mido.get_input_names()[0]
print(f"\nListening to: {port_name}")
print("Press keys on your MIDI keyboard...\n")

# Listen for MIDI messages
with mido.open_input(port_name) as inport:
    for msg in inport:
        if msg.type != 'clock':  # Filter out meaningless "clock time = 0" messages
            print(msg)
