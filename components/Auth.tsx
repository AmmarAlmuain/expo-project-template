import React, { useState } from "react";
import { Alert, StyleSheet, View, AppState } from "react-native";
import { supabase, sendPhoneOtp, verifyPhoneOtp } from "../lib/supabase";
import { Button, Input } from "@rneui/themed";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendOtp() {
    setLoading(true);
    try {
      await sendPhoneOtp(phone);
      Alert.alert(
        "OTP sent!",
        "Please check your phone for the verification code."
      );
    } catch (error: any) {
      Alert.alert("Error sending OTP", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    setLoading(true);
    try {
      await verifyPhoneOtp(phone, password);
      Alert.alert("Success!", "OTP verified and you are now logged in.");
    } catch (error: any) {
      Alert.alert("Error verifying OTP", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Phone"
          leftIcon={{ type: "font-awesome", name: "phone" }}
          onChangeText={(text) => setPhone(text)}
          value={phone}
          placeholder="+964 123 456 78 90"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="OTP"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="OTP"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Send OTP" disabled={loading} onPress={handleSendOtp} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Verify OTP"
          disabled={loading}
          onPress={handleVerifyOtp}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
