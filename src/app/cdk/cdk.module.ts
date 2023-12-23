import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { A11yModule } from "@angular/cdk/a11y";
import { BidiModule } from "@angular/cdk/bidi";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { LayoutModule } from "@angular/cdk/layout";
import { ObserversModule } from "@angular/cdk/observers";
import { OverlayModule } from "@angular/cdk/overlay";
import { PlatformModule } from "@angular/cdk/platform";
import { PortalModule } from "@angular/cdk/portal";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { CdkTableModule } from "@angular/cdk/table";
import { ContentContainerComponentHarness } from "@angular/cdk/testing";
import { TextFieldModule } from "@angular/cdk/text-field";
import { CdkTreeModule } from "@angular/cdk/tree";

@NgModule({
  imports: [
    CommonModule,
    A11yModule,
    BidiModule,
    ClipboardModule,
    DragDropModule,
    LayoutModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    ScrollingModule,
    CdkStepperModule,
    CdkTableModule,
    // ContentContainerComponentHarness,
    TextFieldModule,
    CdkTreeModule
  ],
  declarations: [],
  exports: [
    A11yModule,
    BidiModule,
    ClipboardModule,
    DragDropModule,
    LayoutModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    ScrollingModule,
    CdkStepperModule,
    CdkTableModule,
    // ContentContainerComponentHarness,
    TextFieldModule,
    CdkTreeModule
  ]
})
export class CdkModule {}
