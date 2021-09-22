package br.com.transpop.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;
import com.getcapacitor.community.facebooklogin.FacebookLogin;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    registerPlugin(com.getcapacitor.community.facebooklogin.FacebookLogin.class);
    registerPlugin(com.getcapacitor.community.admob.AdMob.class);
    // Initializes the Bridge

  }
}
