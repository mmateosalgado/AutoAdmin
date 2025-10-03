import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../../core/header/header.component";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [ReactiveFormsModule, HeaderComponent]
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  showPassword = false;


  profile = {
    avatarUrl: '/assets/avatar-placeholder.png',
    name: 'Usuario',
    email: 'user@gmail.com',
    password: '1234',
    website: 'https://placeholder.example.com',
    accounts: {
      instagram: { username: 'CarlitosIg', password: '1234' },
      facebook: { username: 'CarlitosFb', password: '1234' },
      mercadolibre: { username: 'Tienda Carlos', password: '1234' }
    }
  };


  socialServices = [
    { name: 'Instagram', key: 'instagram', usernamePlaceholder: 'usuario_instagram' },
    { name: 'Facebook', key: 'facebook', usernamePlaceholder: 'usuario_facebook' },
    { name: 'Mercado Libre', key: 'mercadolibre', usernamePlaceholder: 'usuario@mercadolibre.com' }
  ];


  constructor(private fb: FormBuilder) { }


  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: [this.profile.name],
      email: [this.profile.email],
      password: [''],
      website: [{ value: this.profile.website, disabled: true }],
      accounts: this.fb.group({
        instagram: this.fb.group({ username: [this.profile.accounts.instagram.username], password: [''] }),
        facebook: this.fb.group({ username: [this.profile.accounts.facebook.username], password: [''] }),
        mercadolibre: this.fb.group({ username: [this.profile.accounts.mercadolibre.username], password: [''] })
      })
    });
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = e => this.profile.avatarUrl = reader.result as string;
      reader.readAsDataURL(input.files[0]);
    }
  }


  onSave() {
    if (this.profileForm.valid) {
      const updatedProfile = { ...this.profile, ...this.profileForm.getRawValue() };
      console.log('Guardar perfil:', updatedProfile);
      // Llamar al servicio que actualiza el perfil
    }
  }


  onReset() {
    this.profileForm.reset({ ...this.profile, website: { value: this.profile.website, disabled: true } });
  }


  onDeleteAccount() {
    if (confirm('¿Estás seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      console.log('Cuenta eliminada');
      // Llamar al servicio para eliminar la cuenta
    }
  }
}