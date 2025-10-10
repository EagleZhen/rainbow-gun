import mido
import pygame

# Initialize pygame mixer for sound
pygame.mixer.init()
gun_sound = pygame.mixer.Sound('samples/tonal-bass-gun_140bpm_D_minor.wav')

screen = pygame.display.set_mode((800, 600))
screen.fill((255, 255, 255))  # White background by default

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
        if msg.type == 'clock':  # Filter out meaningless "clock time = 0" messages
            continue

        print(msg)

        if msg.type == 'note_on':
            if msg.velocity > 0:  # Note pressed down
                gun_sound.play()
                screen.fill((0, 0, 0))
            else:  # Note released
                screen.fill((255, 255, 255))

            pygame.display.flip()
